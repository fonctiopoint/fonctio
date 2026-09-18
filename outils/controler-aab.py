# -*- coding: utf-8 -*-
"""Controle des permissions du manifeste FUSIONNE d'un .aab.

Pourquoi le manifeste fusionne et pas app.json : une bibliotheque peut declarer
une permission sans qu'on l'ait demandee, et c'est le manifeste fusionne qui
part chez Google. La lecon vient d'une precedente soumission Play Store :
repondre « non » au formulaire Identifiant publicitaire alors que AD_ID est
presente fait recaler la soumission.

Pas d'outil Android sur cette machine (ni aapt2 ni bundletool). Ce n'est pas
bloquant : un .aab est un ZIP, et son AndroidManifest.xml est encode en
protobuf ou les noms de permissions restent des chaines UTF-8 lisibles. On les
extrait directement.

Usage : python controler_aab.py <chemin-ou-url-du-aab>
"""
import io
import re
import sys
import zipfile
import urllib.request

# Ce que app.json declare vouloir bloquer.
BLOQUEES = [
    'android.permission.SYSTEM_ALERT_WINDOW',
    'android.permission.DUMP',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.VIBRATE',
]

# Celles qu'on accepte de voir : strictement ce dont l'app a besoin.
ATTENDUES = {
    'android.permission.INTERNET',
    'android.permission.ACCESS_NETWORK_STATE',
}

INTERDITE = 'com.google.android.gms.permission.AD_ID'

# L'app definit et s'accorde sa propre permission, dans son espace de noms et
# en protectionLevel signature : c'est le mecanisme d'AndroidX Core pour
# proteger les receivers enregistres dynamiquement. Elle n'apparait pas sur la
# fiche du magasin et ne concerne qu'une app signee de la meme cle.
PREFIXE_APP = 'com.theguy03.fonctio.'

# Deux motifs, parce que les permissions ne se nomment pas toutes pareil :
#   android.permission.INTERNET              segment « .permission. » minuscule
#   com.…fonctio.DYNAMIC_RECEIVER_NOT_…      pas de segment « permission »
# Le premier motif seul laissait passer les permissions propres a l'app.
MOTIFS = [
    re.compile(rb'[a-zA-Z][a-zA-Z0-9._]{4,80}\.permission\.[A-Z_][A-Z0-9_]{2,60}'),
    re.compile(re.escape(PREFIXE_APP.encode()) + rb'[A-Z_][A-Z0-9_]{2,80}'),
]

# Une permission peut apparaitre dans le manifeste sous DEUX roles opposes :
#
#   <uses-permission android:name="…"/>        DEMANDEE  : l'app la reclame,
#                                                          elle s'affiche sur
#                                                          la fiche du magasin
#   <receiver … android:permission="…"/>       EXIGEE    : l'app restreint qui
#                                                          peut l'appeler ;
#                                                          c'est une garde de
#                                                          securite, pas une
#                                                          capacite reclamee
#
# Les confondre fait crier au loup sur un manifeste sain. Vu le 18/09/2026 avec
# androidx.profileinstaller, dont le receiver exige DUMP de ses appelants.
# blockedPermissions n'agit que sur les DEMANDEES, et c'est correct : retirer
# une garde rendrait le composant moins protege, pas plus.
#
# En protobuf, le nom de l'attribut precede sa valeur. On lit donc la derniere
# chaine lisible avant la permission : « name » -> demandee, « permission » ->
# exigee.
def role(manifeste, position):
    avant = manifeste[max(0, position - 80):position]
    chaines = re.findall(rb'[a-zA-Z][ -~]{2,40}', avant)
    for s in reversed(chaines):
        if s == b'permission':
            return 'exigee'
        if s == b'name':
            return 'demandee'
    return 'indetermine'


def charger(source):
    if source.startswith('http'):
        print('Telechargement de l archive…')
        with urllib.request.urlopen(source) as r:
            return io.BytesIO(r.read())
    return open(source, 'rb')


def main():
    if len(sys.argv) < 2:
        raise SystemExit('Usage : python controler_aab.py <chemin-ou-url-du-aab>')

    brut = charger(sys.argv[1])
    with zipfile.ZipFile(brut) as z:
        noms = [n for n in z.namelist() if n.endswith('AndroidManifest.xml')]
        if not noms:
            raise SystemExit('Aucun AndroidManifest.xml dans l archive.')
        demandees, exigees, propres = set(), set(), set()
        for n in noms:
            data = z.read(n)
            for motif in MOTIFS:
                for m in motif.finditer(data):
                    nom = m.group().decode('utf-8', 'replace')
                    if nom.startswith(PREFIXE_APP):
                        propres.add(nom)
                    elif role(data, m.start()) == 'exigee':
                        exigees.add(nom)
                    else:
                        demandees.add(nom)
        print(f'Manifeste(s) inspecte(s) : {", ".join(noms)}\n')

    trouvees = demandees

    print('PERMISSIONS DEMANDEES  (uses-permission — visibles sur la fiche du magasin)')
    if demandees:
        for p in sorted(demandees):
            marque = 'ok  ' if p in ATTENDUES else 'A VERIFIER'
            print(f'  [{marque}] {p}')
    else:
        print('  (aucune)')

    if exigees:
        print('\nPERMISSIONS EXIGEES DES APPELANTS  (gardes de securite — non reclamees)')
        for p in sorted(exigees):
            print(f'  [ok  ] {p}')

    if propres:
        print('\nPERMISSIONS PROPRES A L APP  (espace de noms du paquet, niveau signature)')
        for p in sorted(propres):
            print(f'  [ok  ] {p}')

    print()
    alertes = []

    if INTERDITE in trouvees:
        alertes.append(
            'AD_ID EST PRESENTE. Repondre « non » au formulaire Identifiant '
            'publicitaire ferait recaler la soumission.')
    else:
        print(f'OK  {INTERDITE} est ABSENTE.')
        print('    -> Identifiant publicitaire : repondre NON en toute surete.')

    restantes = [p for p in BLOQUEES if p in trouvees]
    if restantes:
        alertes.append('blockedPermissions n a pas pris : ' + ', '.join(restantes))
    else:
        print('OK  Les 5 permissions bloquees dans app.json sont bien absentes.')

    inattendues = trouvees - ATTENDUES - {INTERDITE}
    if inattendues:
        alertes.append('Permissions non prevues : ' + ', '.join(sorted(inattendues)))
    else:
        print('OK  Aucune permission au-dela des deux attendues.')

    print()
    if alertes:
        print(f'{len(alertes)} ALERTE(S) :')
        for a in alertes:
            print('  - ' + a)
        sys.exit(1)
    print('AUCUNE ALERTE — le paquet peut partir.')


if __name__ == '__main__':
    main()
