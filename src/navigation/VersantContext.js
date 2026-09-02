// src/navigation/VersantContext.js
// Le versant de l'agent — fpe, fpt ou fph. Presque tout le contenu des fiches en
// dépend.
//
// Ce contexte vivait dans AppNavigator.js, qui importe les écrans, lesquels
// réimportaient AppNavigator pour le lire : un cycle de require, que Metro
// signalait à chaque démarrage. Il fonctionnait — la lecture se fait au rendu,
// pas à l'évaluation du module — mais un cycle finit toujours par livrer une
// valeur non initialisée à quelqu'un. Le contexte est donc ici, sans dépendance.
import React from 'react';

export const VersantContext = React.createContext({ versant: 'fpe', setVersant: () => {} });
