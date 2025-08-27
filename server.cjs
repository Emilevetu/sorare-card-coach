require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const OpenAI = require('openai');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
const dbPath = path.join(__dirname, 'sorare-cards.db');
const db = new Database(dbPath);

// Créer les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    playerId TEXT NOT NULL,
    displayName TEXT NOT NULL,
    position TEXT NOT NULL,
    rarity TEXT NOT NULL,
    xp INTEGER NOT NULL,
    season INTEGER NOT NULL,
    lastUpdated TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS player_performances (
    playerId TEXT PRIMARY KEY,
    displayName TEXT NOT NULL,
    position TEXT NOT NULL,
    l5 REAL DEFAULT 0,
    l15 REAL DEFAULT 0,
    l40 REAL DEFAULT 0,
    dnpPercentage REAL DEFAULT 0,
    gamesPlayed INTEGER DEFAULT 0,
    totalGames INTEGER DEFAULT 0,
    lastUpdated TEXT NOT NULL
  )
`);

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
});

// Charger les règles Sorare
const loadSorareRules = () => {
  try {
    const rulesPath = path.join(__dirname, 'src', 'data', 'sorare-rules.json');
    const rulesData = fs.readFileSync(rulesPath, 'utf8');
    return JSON.parse(rulesData);
  } catch (error) {
    console.error('Erreur lors du chargement des règles:', error);
    return null;
  }
};

const sorareRules = loadSorareRules();

// Fonctions pour accéder aux règles
const getCompetitionRules = (competitionName) => {
  if (!sorareRules || !sorareRules.competitions) return null;
  
  // Normaliser le nom de la compétition
  const normalizedName = competitionName.toLowerCase().replace(/\s+/g, '_');
  return sorareRules.competitions[normalizedName] || null;
};

const getBonusInfo = (bonusType, subType = null) => {
  if (!sorareRules || !sorareRules.bonuses) return null;
  
  if (subType) {
    return sorareRules.bonuses[bonusType]?.[subType] || null;
  }
  return sorareRules.bonuses[bonusType] || null;
};

const getRuleInfo = (ruleType, subType = null) => {
  if (!sorareRules || !sorareRules.rules) return null;
  
  if (subType) {
    return sorareRules.rules[ruleType]?.[subType] || null;
  }
  return sorareRules.rules[ruleType] || null;
};

const getAllCompetitions = () => {
  if (!sorareRules || !sorareRules.competitions) return null;
  return Object.keys(sorareRules.competitions);
};

const getAllBonuses = () => {
  if (!sorareRules || !sorareRules.bonuses) return null;
  return Object.keys(sorareRules.bonuses);
};

// Configuration du modèle
const MODEL_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 1000,
};

// Routes API
app.get('/api/stats', (req, res) => {
  try {
    const cardCount = db.prepare('SELECT COUNT(*) as count FROM cards').get();
    const performanceCount = db.prepare('SELECT COUNT(*) as count FROM player_performances').get();
    
    res.json({
      cards: cardCount.count,
      performances: performanceCount.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cards', (req, res) => {
  try {
    const cards = db.prepare('SELECT * FROM cards ORDER BY lastUpdated DESC').all();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/performances', (req, res) => {
  try {
    const performances = db.prepare('SELECT * FROM player_performances ORDER BY lastUpdated DESC').all();
    res.json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/performance/:playerId', (req, res) => {
  try {
    const performance = db.prepare('SELECT * FROM player_performances WHERE playerId = ?').get(req.params.playerId);
    res.json(performance || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cards', (req, res) => {
  try {
    const { id, slug, playerId, displayName, position, rarity, xp, season } = req.body;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO cards 
      (id, slug, playerId, displayName, position, rarity, xp, season, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, slug, playerId, displayName, position, rarity, xp, season, new Date().toISOString());
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/performances', (req, res) => {
  try {
    const { playerId, displayName, position, l5, l15, l40, dnpPercentage, gamesPlayed, totalGames } = req.body;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO player_performances 
      (playerId, displayName, position, l5, l15, l40, dnpPercentage, gamesPlayed, totalGames, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(playerId, displayName, position, l5, l15, l40, dnpPercentage, gamesPlayed, totalGames, new Date().toISOString());
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour les règles Sorare
app.get('/api/sorare-rules', (req, res) => {
  const { type, name, subType } = req.query;
  
  let result = null;
  
  if (type === 'competition') {
    result = getCompetitionRules(name);
  } else if (type === 'bonus') {
    result = getBonusInfo(name, subType);
  } else if (type === 'rule') {
    result = getRuleInfo(name, subType);
  } else if (type === 'list') {
    if (name === 'competitions') {
      result = getAllCompetitions();
    } else if (name === 'bonuses') {
      result = getAllBonuses();
    }
  }
  
  if (result) {
    res.json({ success: true, data: result });
  } else {
    res.status(404).json({ success: false, error: 'Règle non trouvée' });
  }
});

// Endpoint pour les appels OpenAI
app.post('/api/openai', async (req, res) => {
  const { userMessage, conversationHistory, systemPrompt, userCards } = req.body;

  try {
    // Créer le prompt système avec les fonctions disponibles
    const enhancedSystemPrompt = `${systemPrompt}

## 🔧 FONCTIONS DISPONIBLES
Tu as accès aux règles Sorare via ces fonctions. Utilise-les quand nécessaire :

### Règles de compétition :
- get_competition_rules("premier_league") → règles Premier League
- get_competition_rules("ligue_1") → règles Ligue 1
- get_competition_rules("arena") → règles Arena
- get_competition_rules("champion_europe") → règles Champion Europe

### Bonus et mécaniques :
- get_bonus("xp", "levels") → niveaux XP
- get_bonus("collection", "scoring") → scoring collection
- get_bonus("captain") → bonus capitaine
- get_bonus("new_season") → bonus nouvelle saison

### Règles générales :
- get_rule("divisions") → système de divisions
- get_rule("hot_streak") → mécanique Hot Streak
- get_rule("in_season_status") → statut In-Season

### Listes :
- get_list("competitions") → toutes les compétitions
- get_list("bonuses") → tous les types de bonus

## 📋 COMMENT UTILISER CES FONCTIONS
Si on te pose une question sur les règles, utilise ces fonctions pour donner des réponses précises et à jour.`;

    const messages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    res.json({ 
      response: completion.choices[0].message.content,
      usage: completion.usage 
    });

  } catch (error) {
    console.error('Erreur OpenAI:', error);
    res.status(500).json({ 
      error: "Erreur lors de l'appel à l'API OpenAI",
      details: error.message 
    });
  }
});

// Endpoint pour l'API Sorare
app.post('/api/sorare', async (req, res) => {
  try {
    const { query, variables } = req.body;

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Sorare:', error);
    res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Sorare' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: ${dbPath}`);
});
