# 🎯 Coach IA Sorare

Application web pour analyser vos cartes Sorare et optimiser votre stratégie fantasy football.

## 🚀 Fonctionnalités

### ✅ Implémentées
- **Recherche de cartes** : Entrez votre slug Sorare pour voir toutes vos cartes
- **Base de données locale** : Sauvegarde automatique des informations clés (playerId, position, rarity, xp, season)
- **Métriques de performance** : Calcul automatique des métriques L5, L15, L40 et DNP%
- **GameWeeks Sorare** : Récupération des vraies GameWeeks avec compétitions et divisions
- **Interface moderne** : Design responsive avec filtres et tri
- **Proxy API** : Contournement des restrictions CORS

### 📊 Métriques calculées
- **L5** : Moyenne des scores sur les 5 derniers matchs
- **L15** : Moyenne des scores sur les 15 derniers matchs  
- **L40** : Moyenne des scores sur les 40 derniers matchs
- **DNP%** : Pourcentage de matchs où le joueur n'a pas joué
- **Score attendu** : Calcul basé sur L15 + bonus disponibilité

### 🏆 Compétitions supportées
- **All-Star** : Compétition principale avec les meilleures récompenses
- **Champion** : Compétition pour les meilleurs joueurs
- **Under 23** : Compétition pour joueurs de moins de 23 ans
- **Arena** : Compétition spéciale
- **Arena Uncapped** : Compétition sans limite
- **Toutes les ligues** : Premier League, LALIGA, Bundesliga, Ligue 1, etc.

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository>
cd sorare-card-coach

# Installer les dépendances
npm install

# Démarrer le serveur backend
npm run server

# Dans un autre terminal, démarrer le frontend
npm run dev

# Ou démarrer les deux en même temps
npm run dev:full
```

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── cards-table.tsx  # Tableau des cartes avec métriques
│   ├── performance-metrics.tsx  # Affichage des performances
│   ├── gameweeks-simple.tsx  # Affichage des GameWeeks
│   └── ...
├── lib/
│   └── sorare-api.ts    # API Sorare avec proxy
├── types/
│   └── sorare.ts        # Types TypeScript
└── pages/
    └── Index.tsx        # Page principale

server.cjs              # Serveur backend Express
sorare-cards.db         # Base de données SQLite
```

## 🗄️ Base de données

### Table `cards`
- `id` : ID unique de la carte
- `slug` : Slug de la carte
- `playerId` : ID du joueur
- `displayName` : Nom du joueur
- `position` : Position (Attaquant, Milieu, Défenseur, Gardien)
- `rarity` : Rareté (Limited, Rare, Super Rare, Unique)
- `xp` : Points d'expérience
- `season` : Saison
- `lastUpdated` : Date de dernière mise à jour

### Table `player_performances`
- `playerId` : ID du joueur
- `displayName` : Nom du joueur
- `position` : Position
- `l5`, `l15`, `l40` : Moyennes de scores
- `dnpPercentage` : Pourcentage de non-participation
- `gamesPlayed` : Nombre de matchs joués
- `totalGames` : Nombre total de matchs
- `lastUpdated` : Date de dernière mise à jour

## 🔧 API Endpoints

### Backend (port 3001)
- `GET /api/stats` : Statistiques de la base de données
- `GET /api/cards` : Toutes les cartes
- `GET /api/performances` : Toutes les performances
- `GET /api/performance/:playerId` : Performance d'un joueur
- `POST /api/cards` : Sauvegarder une carte
- `POST /api/performances` : Sauvegarder une performance
- `POST /api/sorare` : Proxy vers l'API Sorare

## 🎯 Utilisation

1. **Démarrer l'application** : `npm run dev:full`
2. **Ouvrir** : http://localhost:8080
3. **Voir les GameWeeks** : Les GameWeeks s'affichent automatiquement en haut
4. **Rechercher vos cartes** : Entrer votre slug (ex: `emiliodelamuerte`)
5. **Analyser** : Voir vos cartes avec métriques et performances
6. **Charger les performances** : Cliquer sur "Charger perf" pour chaque joueur

## 🏆 Compétitions MVP

### Données réelles de l'API Sorare
- **All-Star** : Compétition principale
- **Champion** : Compétition pour les meilleurs
- **Under 23** : Compétition pour joueurs U23
- **Arena** : Compétition spéciale
- **Toutes les ligues** : Premier League, LALIGA, Bundesliga, etc.

### Informations affichées
- **Statut** : Ouvert, en cours, fermé
- **Dates** : Période de la GameWeek
- **Compétitions** : Toutes les compétitions disponibles
- **Divisions** : Division 1, 2, 3, 4
- **Raretés** : Limited, Rare, Super Rare, Unique
- **Actions** : Boutons pour analyser vos cartes

## 🔮 Prochaines étapes

- [ ] Optimisation automatique des lineups
- [ ] Remplacement automatique en cas de DNP
- [ ] Recommandations d'achat
- [ ] Intégration des bonus XP et capitaine
- [ ] Analyse de compatibilité cartes/GameWeeks

## 🛡️ Sécurité

- Proxy local pour contourner les CORS
- Base de données locale (pas de données sensibles envoyées)
- Validation des données côté serveur

## 📝 Licence

MIT
