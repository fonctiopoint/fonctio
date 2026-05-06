// src/screens/FicheDetailScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, useTheme } from '../theme';
import { getFicheById, MODULES } from '../data/fiches';
import { VersantContext } from '../navigation/AppNavigator';
import { addFavori, removeFavori, isFavori, addRecent } from '../utils/storage';

const Block = ({ title, dotColor, children }) => (
  <View style={styles.block}>
    <View style={styles.blockTitle}>
      <View style={[styles.blockDot, { backgroundColor: dotColor }]} />
      <Text style={styles.blockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

const StepItem = ({ num, titre, texte, color }) => {
  const { fs } = useTheme();
  return (
    <View style={styles.step}>
      <View style={[styles.stepNum, { backgroundColor: color }]}>
        <Text style={styles.stepNumText}>{num}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitre, { fontSize: fs(12) }]}>{titre}</Text>
        <Text style={[styles.stepTexte, { fontSize: fs(12), lineHeight: fs(12) * 1.55 }]}>{texte}</Text>
      </View>
    </View>
  );
};

const DroitRow = ({ label, valeur, detail }) => {
  const { fs } = useTheme();
  return (
    <View style={styles.droitRow}>
      {/* Layout vertical : label → valeur → détail — aucun chevauchement possible */}
      <Text style={[styles.droitLabel, { fontSize: fs(11) }]}>{label}</Text>
      <Text style={[styles.droitValeur, { fontSize: fs(14), lineHeight: fs(14) * 1.4 }]}>{valeur}</Text>
      {detail && (
        <Text style={[styles.droitDetail, { fontSize: fs(11), lineHeight: fs(11) * 1.55 }]}>
          {detail}
        </Text>
      )}
    </View>
  );
};

// Résout le bon tableau selon le versant
// Supporte : fiche.tableau (simple ou avec versants:[]), fiche.tableaux {fpe,fpt,fph}, fiche.tableauFpt etc.
const resolveTableau = (fiche, versant) => {
  // Pattern 1 : objet tableaux par versant
  if (fiche.tableaux?.[versant]) return fiche.tableaux[versant];
  // Pattern 2 : tableauFpt / tableauFpe / tableauFph
  const specific = fiche[`tableau${versant.charAt(0).toUpperCase() + versant.slice(1)}`];
  if (specific) return specific;
  // Pattern 3 : tableau simple avec champ versants optionnel
  if (fiche.tableau) {
    const t = fiche.tableau;
    if (!t.versants || t.versants.includes(versant)) return t;
    return null;
  }
  return null;
};

const TableauSynthetique = ({ fiche, versant, color }) => {
  const tableau = resolveTableau(fiche, versant);
  if (!tableau) return null;
  return (
    <View style={styles.block}>
      <View style={styles.blockTitle}>
        <View style={[styles.blockDot, { backgroundColor: color }]} />
        <Text style={styles.blockTitleText}>{tableau.titre || 'Tableau synthétique'}</Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          {tableau.colonnes.map((col, i) => (
            <Text key={i} style={[styles.tableHeaderCell, { flex: col.flex || 1 }]}>{col.label}</Text>
          ))}
        </View>
        {tableau.lignes.map((ligne, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            {ligne.map((cell, j) => (
              <Text key={j} style={[styles.tableCell, { flex: tableau.colonnes[j]?.flex || 1 }, j === 0 && styles.tableCellFirst]}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const BesoinAideSection = () => (
  <View style={styles.aideCard}>
    <View style={styles.aideHeader}>
      <View style={styles.aideIconBox}><Text style={styles.aideIconText}>🤝</Text></View>
      <View style={styles.aideHeaderText}>
        <Text style={styles.aideTitle}>Besoin d'aide ?</Text>
        <Text style={styles.aideSub}>Votre assistant de service social du personnel</Text>
      </View>
    </View>
    <Text style={styles.aideBody}>
      Pour toute question relative à votre vie personnelle ou professionnelle, n'hésitez pas à contacter votre assistant de service social du personnel. Cet accompagnement est gratuit, confidentiel et sans jugement.
    </Text>
    <Text style={styles.aideNote}>
      Coordonnées disponibles sur l'intranet de votre administration ou auprès de votre service RH.
    </Text>
  </View>
);

// ── Accordéon Droits — seuil à 3 entrées ─────────────────────────────────────
const DroitsAccordeon = ({ droits, seuil = 3, moduleColor }) => {
  const [expanded, setExpanded] = useState(droits.length <= seuil);
  const visible = expanded ? droits : droits.slice(0, seuil);
  const reste = droits.length - seuil;

  return (
    <View style={styles.block}>
      <View style={styles.blockTitle}>
        <View style={[styles.blockDot, { backgroundColor: moduleColor }]} />
        <Text style={styles.blockTitleText}>Droits & durées</Text>
      </View>
      {visible.map((d, i) => (
        <React.Fragment key={i}>
          <DroitRow {...d} />
          {i < visible.length - 1 && <View style={styles.droitDivider} />}
        </React.Fragment>
      ))}
      {droits.length > seuil && (
        <>
          {!expanded && <View style={styles.droitDivider} />}
          <TouchableOpacity
            style={styles.accordeonBtn}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.75}
          >
            <Text style={[styles.accordeonText, { color: moduleColor }]}>
              {expanded ? '▲ Voir moins' : `▼ Voir ${reste} entrée${reste > 1 ? 's' : ''} de plus`}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// ── Accordéon Étapes ──────────────────────────────────────────────────────────
const EtapesAccordeon = ({ etapes, seuil = 3, moduleColor }) => {
  const [expanded, setExpanded] = useState(etapes.length <= seuil);
  const visible = expanded ? etapes : etapes.slice(0, seuil);
  const reste = etapes.length - seuil;
  return (
    <Block title="Les étapes" dotColor={Colors.sky}>
      <View style={styles.stepList}>
        {visible.map(e => <StepItem key={e.num} {...e} color={moduleColor} />)}
      </View>
      {etapes.length > seuil && (
        <TouchableOpacity style={styles.accordeonBtn} onPress={() => setExpanded(!expanded)} activeOpacity={0.75}>
          <Text style={[styles.accordeonText, { color: Colors.sky }]}>
            {expanded ? '▲ Voir moins' : `▼ Voir ${reste} étape${reste > 1 ? 's' : ''} de plus`}
          </Text>
        </TouchableOpacity>
      )}
    </Block>
  );
};

// ── Accordéon Points d'attention ──────────────────────────────────────────────
const PiegesAccordeon = ({ pieges }) => {
  const SEUIL = 3;
  const { fs } = useTheme();
  const [expanded, setExpanded] = useState(pieges.length <= SEUIL);
  const visible = expanded ? pieges : pieges.slice(0, SEUIL);
  const reste = pieges.length - SEUIL;
  return (
    <View style={styles.piegeCard}>
      <View style={styles.piegeHeader}>
        <Text style={styles.piegeIcon}>⚠️</Text>
        <Text style={styles.piegeLabel}>POINTS D'ATTENTION</Text>
      </View>
      {visible.map((p, i) => {
        const texte = typeof p === 'object' ? p.texte : p;
        return (
          <View key={i} style={styles.piegeItem}>
            <Text style={styles.piegeArrow}>→</Text>
            <Text style={[styles.piegeText, { fontSize: fs(12), lineHeight: fs(12) * 1.55 }]}>{texte}</Text>
          </View>
        );
      })}
      {pieges.length > SEUIL && (
        <TouchableOpacity style={styles.accordeonBtn} onPress={() => setExpanded(!expanded)} activeOpacity={0.75}>
          <Text style={[styles.accordeonText, { color: Colors.danger }]}>
            {expanded ? '▲ Voir moins' : `▼ Voir ${reste} point${reste > 1 ? 's' : ''} de plus`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ── Accordéon Sources ─────────────────────────────────────────────────────────
const SourcesAccordeon = ({ sources }) => {
  const SEUIL = 2;
  const [expanded, setExpanded] = useState(sources.length <= SEUIL);
  const visible = expanded ? sources : sources.slice(0, SEUIL);
  const reste = sources.length - SEUIL;
  return (
    <View style={styles.sourcesCard}>
      <View style={styles.sourcesHeader}>
        <View style={styles.sourcesIconBox}><Text style={styles.sourcesIconText}>§</Text></View>
        <Text style={styles.sourcesTitle}>Sources juridiques</Text>
      </View>
      {visible.map((s, i) => (
        <View key={i} style={styles.sourceRow}>
          <View style={styles.sourceBullet} />
          <Text style={styles.sourceText}>{s.texte}</Text>
        </View>
      ))}
      {sources.length > SEUIL && (
        <TouchableOpacity style={styles.accordeonBtn} onPress={() => setExpanded(!expanded)} activeOpacity={0.75}>
          <Text style={[styles.accordeonText, { color: Colors.olive }]}>
            {expanded ? '▲ Voir moins' : `▼ Voir ${reste} source${reste > 1 ? 's' : ''} de plus`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const VERSANT_LABELS = { fpe: 'État (FPE)', fpt: 'Territoriale (FPT)', fph: 'Hospitalière (FPH)' };
const VERSANT_COLORS = { fpe: Colors.terracotta, fpt: Colors.sky, fph: Colors.olive };
const VERSANT_ICONS = { fpe: '🏛️', fpt: '🏙️', fph: '🏥' };

const VersantNote = ({ note, versant, theme }) => {
  if (!note) return null;
  const color = VERSANT_COLORS[versant] || Colors.sky;
  const isWarning = note.startsWith('⚠️');
  const bgColor = isWarning ? Colors.amberLight : Colors.oliveLight;
  const borderColor = isWarning ? Colors.amber : color;
  return (
    <View style={[vnStyles.card, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
      <View style={vnStyles.header}>
        <Text style={vnStyles.icon}>{VERSANT_ICONS[versant]}</Text>
        <Text style={[vnStyles.label, { color: isWarning ? Colors.terracottaDark : color }]}>
          Pour vous — FP {VERSANT_LABELS[versant]}
        </Text>
      </View>
      <Text style={[vnStyles.text, { color: theme.textSecondary }]}>{note}</Text>
    </View>
  );
};

const vnStyles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg, padding: Spacing.lg,
    borderLeftWidth: 4, marginBottom: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  icon: { fontSize: 15 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.05 },
  text: { fontSize: Typography.sm, lineHeight: 19 },
});

export default function FicheDetailScreen({ navigation, route }) {
  const { ficheId, ficheIndex, ficheTotal, moduleTitle } = route.params || {};
  const fiche = getFicheById(ficheId);
  const { versant } = useContext(VersantContext);

  if (!fiche) return null;

  // Fil d'Ariane : Accueil > Module > Fiche
  const breadcrumb = moduleTitle || fiche.categorie;
  // Indicateur de position dans le module
  const hasPosition = ficheIndex !== undefined && ficheTotal !== undefined;
  const positionLabel = hasPosition ? `Fiche ${ficheIndex + 1} / ${ficheTotal}` : null;

  const [favori, setFavori] = useState(false);

  useEffect(() => {
    if (!fiche) return;
    // Marquer comme récente
    addRecent(ficheId);
    // Charger état favori
    isFavori(ficheId).then(setFavori);
  }, [ficheId]);

  const toggleFavori = async () => {
    if (favori) { await removeFavori(ficheId); setFavori(false); }
    else { await addFavori(ficheId); setFavori(true); }
  };

  if (!fiche) return null;

  // Mapping fiche → régime simulateur pour le bouton "Simuler"
  const FICHE_TO_REGIME = {
    'cmo': { statut: 'titulaire', regime: 'cmo' },
    'clm': { statut: 'titulaire', regime: 'clm' },
    'cld': { statut: 'titulaire', regime: 'cld' },
    'tpt': { statut: 'titulaire', regime: 'tpt' },
    'at-service': { statut: 'titulaire', regime: 'citis' },
    'cmo-contractuels': { statut: 'contractuel', regime: 'cmo_c' },
    'cgm': { statut: 'contractuel', regime: 'cgm' },
    'at-contractuels': { statut: 'contractuel', regime: 'at_c' },
  };
  const simulerParams = FICHE_TO_REGIME[ficheId];

  const handleShare = async () => {
    // Construire le texte complet de la fiche
    const lines = [];
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`FONCTIO. — Fiche pratique`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(``);
    lines.push(`📋 ${fiche.titre}`);
    lines.push(`📁 ${fiche.categorie}`);
    lines.push(``);

    if (fiche.chips?.length) {
      lines.push(`🏷️  ${fiche.chips.join(' · ')}`);
      lines.push(``);
    }

    lines.push(`EN RÉSUMÉ`);
    lines.push(`─────────`);
    lines.push(fiche.resume);
    lines.push(``);

    if (fiche.ciblePublic) {
      lines.push(`👥 Concerne : ${fiche.ciblePublic}`);
      lines.push(``);
    }

    if (fiche.droits?.length) {
      lines.push(`DROITS & DURÉES`);
      lines.push(`───────────────`);
      fiche.droits.forEach(d => {
        lines.push(`• ${d.label} : ${d.valeur}`);
        if (d.detail) lines.push(`  ${d.detail}`);
      });
      lines.push(``);
    }

    if (fiche.etapes?.length) {
      lines.push(`LES ÉTAPES`);
      lines.push(`──────────`);
      fiche.etapes.forEach(e => {
        lines.push(`${e.num}. ${e.titre}`);
        lines.push(`   ${e.texte}`);
      });
      lines.push(``);
    }

    if (fiche.pieges?.length) {
      lines.push(`⚠️  POINTS D'ATTENTION`);
      lines.push(`─────────────────────`);
      fiche.pieges.forEach(p => lines.push(`→ ${p}`));
      lines.push(``);
    }

    if (fiche.recours) {
      lines.push(`EN CAS DE REFUS`);
      lines.push(`───────────────`);
      lines.push(fiche.recours);
      lines.push(``);
    }

    if (fiche.sources?.length) {
      lines.push(`SOURCES JURIDIQUES`);
      lines.push(`──────────────────`);
      fiche.sources.forEach(s => lines.push(`§ ${s.texte}`));
      lines.push(``);
    }

    lines.push(`─────────────────────────`);
    lines.push(`Fonctio. — Application informative.`);
    lines.push(`Cette fiche ne remplace pas un conseil juridique.`);
    lines.push(`Rapprochez-vous de votre assistant de service social du personnel.`);

    await Share.share({
      message: lines.join('\n'),
      title: fiche.titre,
    });
  };

  const moduleColor = fiche.moduleColor || Colors.terracotta;
  const moduleBg = fiche.moduleBg || Colors.terracottaLight;
  const theme = useTheme();
  const { fs } = theme;
  const versantNote = fiche.versantNotes?.[versant];
  // Taille de police dynamique pour le corps des fiches
  const sz = (base) => ({ fontSize: fs(base) });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: moduleColor }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={moduleColor} />

      <View style={[styles.header, { backgroundColor: moduleColor }]}>
        {/* Ligne 1 : Fil d'Ariane + bouton partager */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.breadcrumb}>
              Accueil
              <Text style={styles.breadcrumbSep}> › </Text>
              {breadcrumb}
            </Text>
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={toggleFavori} style={styles.shareBtn}>
              <Ionicons
                name={favori ? 'star' : 'star-outline'}
                size={20}
                color={favori ? '#FFD700' : 'rgba(255,255,255,0.8)'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
              <Ionicons name="share-outline" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ligne 2 : indicateur de position */}
        {hasPosition && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {
                width: `${((ficheIndex + 1) / ficheTotal) * 100}%`,
                backgroundColor: 'rgba(255,255,255,0.9)',
              }]} />
            </View>
            <Text style={styles.progressLabel}>{positionLabel}</Text>
          </View>
        )}

        <Text style={styles.headerCat}>Fiche pratique</Text>
        <Text style={[styles.headerTitle, { fontSize: fs(18), lineHeight: fs(18) * 1.4 }]}>{fiche.titre}</Text>
        <View style={styles.chips}>
          {fiche.chips.map(chip => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Résumé */}
        <View style={[styles.resumeCard, { borderLeftColor: moduleColor, backgroundColor: moduleBg }]}>
          <Text style={[styles.resumeLabel, { color: moduleColor }]}>EN RÉSUMÉ</Text>
          <Text style={[styles.resumeText, { color: Colors.terracottaDark, fontSize: fs(14), lineHeight: fs(14) * 1.6 }]}>{fiche.resume}</Text>
        </View>

        {/* Note spécifique au versant de l'agent */}
        {versantNote && <VersantNote note={versantNote} versant={versant} theme={theme} />}

        {/* Qui est concerné */}
        {fiche.ciblePublic && (
          <View style={styles.cibleCard}>
            <Ionicons name="people-outline" size={16} color={Colors.slateLight} />
            <Text style={[styles.cibleText, { fontSize: fs(12), lineHeight: fs(12) * 1.55 }]}>{fiche.ciblePublic}</Text>
          </View>
        )}

        {/* Droits — avec accordéon si > 5 entrées, filtrage par versant */}
        {(() => {
          const droitsFiltres = (fiche.droits || []).filter(d => !d.versants || d.versants.includes(versant));
          if (!droitsFiltres.length) return null;
          const seuil = 3;
          return <DroitsAccordeon droits={droitsFiltres} seuil={seuil} moduleColor={moduleColor} />;
        })()}

        {/* Tableau synthétique — résolution automatique selon versant */}
        <TableauSynthetique fiche={fiche} versant={versant} color={moduleColor} />

        {/* Étapes — accordéon à partir de 3 */}
        {(() => {
          const etapesFiltrees = (fiche.etapes || []).filter(e => !e.versants || e.versants.includes(versant));
          if (!etapesFiltrees.length) return null;
          const SEUIL_ETAPES = 3;
          return <EtapesAccordeon etapes={etapesFiltrees} seuil={SEUIL_ETAPES} moduleColor={moduleColor} />;
        })()}

        {/* Points d'attention — accordéon à partir de 3 */}
        {(() => {
          const piegesFiltres = (fiche.pieges || []).filter(p =>
            typeof p === 'object' ? (!p.versants || p.versants.includes(versant)) : true
          );
          if (!piegesFiltres.length) return null;
          return <PiegesAccordeon pieges={piegesFiltres} />;
        })()}

        {/* Recours */}
        {fiche.recours && (
          <Block title="Et si l'administration refuse ?" dotColor={Colors.olive}>
            <Text style={styles.recoursText}>{fiche.recours}</Text>
          </Block>
        )}

        {/* Sources — accordéon à partir de 2 */}
        {fiche.sources?.length > 0 && (
          <SourcesAccordeon sources={fiche.sources} />
        )}

        {/* Bouton Simuler ce congé */}
        {simulerParams && (
          <TouchableOpacity
            style={styles.simulerBtn}
            onPress={() => navigation.navigate('SimulateurTabs', {
              screen: 'SimulateurMain',
              params: simulerParams,
            })}
            activeOpacity={0.85}
          >
            <View style={styles.simulerLeft}>
              <Text style={styles.simulerEmoji}>🧮</Text>
              <View>
                <Text style={styles.simulerTitle}>Simuler ce congé</Text>
                <Text style={styles.simulerSub}>Projeter vos revenus sur toute la durée</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.sky} />
          </TouchableOpacity>
        )}

        {/* Besoin d'aide */}
        <BesoinAideSection />

        {/* Navigation Précédent / Suivant dans le module */}
        {hasPosition && (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[styles.navBtn, { opacity: ficheIndex > 0 ? 1 : 0.3 }]}
              disabled={ficheIndex <= 0}
              onPress={() => {
                if (ficheIndex > 0) {
                  // Récupère la fiche précédente dans le module
                  
                  const mod = MODULES.find(m => m.fiches?.some(f => f.id === ficheId));
                  if (mod) {
                    const prevFiche = mod.fiches[ficheIndex - 1];
                    navigation.replace('FicheDetail', {
                      ficheId: prevFiche.id,
                      moduleId: mod.id,
                      ficheIndex: ficheIndex - 1,
                      ficheTotal,
                      moduleTitle,
                    });
                  }
                }
              }}
              activeOpacity={0.75}
            >
              <Ionicons name="chevron-back" size={16} color={Colors.terracotta} />
              <Text style={styles.navBtnText}>Précédent</Text>
            </TouchableOpacity>

            <Text style={styles.navCounter}>{ficheIndex + 1} / {ficheTotal}</Text>

            <TouchableOpacity
              style={[styles.navBtn, { opacity: ficheIndex < ficheTotal - 1 ? 1 : 0.3 }]}
              disabled={ficheIndex >= ficheTotal - 1}
              onPress={() => {
                if (ficheIndex < ficheTotal - 1) {
                  
                  const mod = MODULES.find(m => m.fiches?.some(f => f.id === ficheId));
                  if (mod) {
                    const nextFiche = mod.fiches[ficheIndex + 1];
                    navigation.replace('FicheDetail', {
                      ficheId: nextFiche.id,
                      moduleId: mod.id,
                      ficheIndex: ficheIndex + 1,
                      ficheTotal,
                      moduleTitle,
                    });
                  }
                }
              }}
              activeOpacity={0.75}
            >
              <Text style={styles.navBtnText}>Suivant</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.terracotta} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Cette fiche est informative et ne remplace pas un accompagnement par votre assistant de service social du personnel ou un conseil juridique.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  back: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  breadcrumb: { fontSize: 12, color: 'rgba(255,255,255,0.7)', flexShrink: 1 },
  breadcrumbSep: { color: 'rgba(255,255,255,0.4)' },
  headerButtons: { flexDirection: 'row', gap: 4 },
  shareBtn: { padding: 6 },

  // Barre de progression dans le module
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  progressTrack: {
    flex: 1, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '500', minWidth: 55, textAlign: 'right' },

  headerCat: { fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.06, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { fontSize: Typography.xl, color: Colors.white, fontWeight: '600', lineHeight: 28 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.sm },
  chip: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 10, color: 'rgba(255,255,255,0.9)' },

  scroll: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100, gap: 10 },

  resumeCard: { borderRadius: Radius.lg, padding: Spacing.lg, borderLeftWidth: 3 },
  resumeLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 0.06, textTransform: 'uppercase', marginBottom: 5 },
  resumeText: { fontSize: Typography.base, lineHeight: 22 },

  cibleCard: { backgroundColor: Colors.warm, borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  cibleText: { fontSize: Typography.sm, color: Colors.slateMid, lineHeight: 18, flex: 1 },

  block: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 0.5, borderColor: Colors.border, ...Shadow.sm },
  blockTitle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  blockDot: { width: 6, height: 6, borderRadius: 3 },
  blockTitleText: { fontSize: Typography.sm, fontWeight: '500', color: Colors.slate, textTransform: 'uppercase', letterSpacing: 0.05 },

  droitRow: { paddingVertical: 6 },
  droitTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }, // kept for compat
  droitLabel: { fontSize: 11, color: Colors.slateLight, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.04 },
  droitValeur: { fontWeight: '700', color: Colors.terracotta, marginBottom: 3 },
  droitDetail: { color: Colors.slateMid },
  droitDivider: { height: 0.5, backgroundColor: Colors.border, marginVertical: 4 },
  accordeonBtn: { alignItems: 'center', paddingTop: 8 },
  accordeonText: { fontSize: 12, fontWeight: '600' },

  tableContainer: { borderRadius: Radius.sm, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: Colors.slate },
  tableRowEven: { backgroundColor: Colors.white },
  tableRowOdd: { backgroundColor: Colors.warm },
  tableHeaderCell: { fontSize: 10, color: 'white', fontWeight: '600', padding: 7, textTransform: 'uppercase', letterSpacing: 0.04 },
  tableCell: { fontSize: 11, color: Colors.slateMid, padding: 7, lineHeight: 15 },
  tableCellFirst: { color: Colors.slate, fontWeight: '500' },

  stepList: { gap: 12 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  stepNum: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepNumText: { fontSize: 11, color: 'white', fontWeight: '600' },
  stepContent: { flex: 1 },
  stepTitre: { fontSize: Typography.sm, fontWeight: '500', color: Colors.slate, marginBottom: 2 },
  stepTexte: { fontSize: Typography.sm, color: Colors.slateMid, lineHeight: 18 },

  piegeCard: { backgroundColor: Colors.dangerLight, borderRadius: Radius.lg, padding: Spacing.lg, borderLeftWidth: 3, borderLeftColor: Colors.danger },
  piegeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  piegeIcon: { fontSize: 14 },
  piegeLabel: { fontSize: 10, fontWeight: '500', color: Colors.danger, letterSpacing: 0.06, textTransform: 'uppercase' },
  piegeItem: { flexDirection: 'row', gap: 6, marginBottom: 6, alignItems: 'flex-start' },
  piegeArrow: { fontSize: Typography.sm, color: Colors.danger, flexShrink: 0, marginTop: 1 },
  piegeText: { fontSize: Typography.sm, color: '#7B2D26', lineHeight: 18, flex: 1 },

  recoursText: { fontSize: Typography.sm, color: Colors.slateMid, lineHeight: 20 },

  // Sources — sans lien
  sourcesCard: { backgroundColor: Colors.oliveLight, borderRadius: Radius.lg, padding: Spacing.lg },
  sourcesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sourcesIconBox: { width: 28, height: 28, borderRadius: 7, backgroundColor: Colors.olive, alignItems: 'center', justifyContent: 'center' },
  sourcesIconText: { fontSize: 13, color: 'white', fontWeight: '700' },
  sourcesTitle: { fontSize: Typography.sm, fontWeight: '500', color: Colors.olive },
  sourceRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5, borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.06)', gap: 8 },
  sourceBullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.olive, marginTop: 6, flexShrink: 0 },
  sourceText: { fontSize: Typography.sm, color: Colors.olive, flex: 1, lineHeight: 18 },

  // Besoin d'aide
  aideCard: { backgroundColor: Colors.oliveLight, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: 'rgba(92,107,69,0.25)' },
  aideHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md },
  aideIconBox: { width: 38, height: 38, borderRadius: Radius.sm, backgroundColor: Colors.olive, alignItems: 'center', justifyContent: 'center' },
  aideIconText: { fontSize: 18 },
  aideHeaderText: { flex: 1 },
  aideTitle: { fontSize: Typography.base, fontWeight: '600', color: Colors.olive },
  aideSub: { fontSize: Typography.xs, color: Colors.slateMid, marginTop: 1 },
  aideBody: { fontSize: Typography.sm, color: Colors.slateMid, lineHeight: 19, marginBottom: 8 },
  aideNote: { fontSize: 11, color: Colors.slateLight, fontStyle: 'italic', lineHeight: 16 },

  // Bouton Simuler
  simulerBtn: {
    backgroundColor: Colors.skyLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.sky + '55',
  },
  simulerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  simulerEmoji: { fontSize: 22 },
  simulerTitle: { fontSize: Typography.base, fontWeight: '600', color: Colors.sky },
  simulerSub: { fontSize: 11, color: Colors.slateMid, marginTop: 1 },

  // Navigation précédent / suivant
  navRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 0.5, borderColor: Colors.border,
    ...Shadow.sm,
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  navBtnText: { fontSize: 13, color: Colors.terracotta, fontWeight: '600' },
  navCounter: { fontSize: 12, color: Colors.slateLight },

  disclaimer: { paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  disclaimerText: { fontSize: 11, color: Colors.slateLight, textAlign: 'center', lineHeight: 16, fontStyle: 'italic' },
});
