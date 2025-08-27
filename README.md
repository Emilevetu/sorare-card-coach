# Sorare Card Coach

Une application web pour analyser vos cartes Sorare et obtenir des conseils personnalisés grâce à l'IA.

## 🚀 Fonctionnalités

- **Analyse de cartes** : Visualisez toutes vos cartes Sorare avec leurs performances
- **Coach IA** : Conseils personnalisés basés sur vos cartes et les règles du jeu
- **Filtres avancés** : Recherche par joueur, rareté, position, âge, ligue, saison
- **GameWeeks** : Visualisation des prochaines GameWeeks et compétitions
- **Interface moderne** : Design Apple-inspired avec une UX optimisée

## 🛠️ Technologies

- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend** : Node.js + Express
- **IA** : OpenAI GPT-4o
- **API** : Sorare GraphQL API
- **Base de données** : SQLite

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/sorare-card-coach.git
cd sorare-card-coach
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos clés API :
```env
VITE_OPENAI_API_KEY=votre_clé_openai_ici
```

4. **Démarrer l'application**
```bash
# Terminal 1 - Backend
node server.cjs

# Terminal 2 - Frontend
npm run dev
```

L'application sera accessible sur `http://localhost:8081/`

## 🌐 Déploiement

### Sur Render

1. **Connectez votre repository GitHub à Render**
2. **Créez un nouveau Web Service**
3. **Configuration :**
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `node server.cjs`
   - **Environment Variables** :
     - `VITE_OPENAI_API_KEY` : Votre clé OpenAI
     - `NODE_ENV` : `production`

### Variables d'environnement requises

- `VITE_OPENAI_API_KEY` : Clé API OpenAI pour le coach IA

## 📱 Utilisation

1. **Connexion** : Entrez votre slug Sorare dans la barre de recherche
2. **Analyse** : Consultez vos cartes avec leurs performances L15
3. **Conseils** : Utilisez le "Mon Coach Test" pour des recommandations IA
4. **Filtres** : Utilisez les filtres pour trouver des cartes spécifiques

## 🔧 Structure du projet

```
src/
├── components/          # Composants React
├── pages/              # Pages principales
├── lib/                # Utilitaires et API
├── types/              # Types TypeScript
└── data/               # Données statiques (règles)
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug
- Proposer une nouvelle fonctionnalité
- Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT.

## ⚠️ Disclaimer

Cette application n'est pas affiliée à Sorare. Elle utilise l'API publique de Sorare pour récupérer les données des cartes.
