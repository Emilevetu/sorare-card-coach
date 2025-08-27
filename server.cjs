require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const OpenAI = require('openai');
// Import axios pour les requêtes HTTP
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');

console.log('🚀 Démarrage du serveur...');
console.log(`📋 Environnement: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔑 OpenAI API Key configurée: ${process.env.VITE_OPENAI_API_KEY ? 'Oui' : 'Non'}`);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Configuration des middlewares...');

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Middlewares configurés');

// Servir les fichiers statiques du frontend (en production)
if (process.env.NODE_ENV === 'production') {
  console.log('📁 Configuration des fichiers statiques...');
  const staticPath = path.join(__dirname, 'dist');
  console.log(`📂 Chemin des fichiers statiques: ${staticPath}`);
  
  // Vérifier si le dossier dist existe
  if (fs.existsSync(staticPath)) {
    console.log('✅ Dossier dist trouvé');
    app.use(express.static(staticPath));
    console.log('✅ Fichiers statiques configurés');
  } else {
    console.log('❌ Dossier dist non trouvé');
  }
}

console.log('🗄️ Initialisation de la base de données...');

// Initialiser la base de données
const dbPath = path.join(__dirname, 'sorare-cards.db');
console.log(`📊 Chemin de la base de données: ${dbPath}`);

let db;
try {
  db = new Database(dbPath);
  console.log('✅ Base de données initialisée');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
  process.exit(1);
}

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
    // Analyser le message utilisateur pour détecter les demandes de règles
    let enhancedUserMessage = userMessage;
    let rulesContext = "";
    
    // Détecter les demandes de règles et récupérer les données
    const competitionMatches = userMessage.match(/premier league|ligue 1|laliga|bundesliga|arena|champion europe|u23|all star|challenger|contender/gi);
    const bonusMatches = userMessage.match(/xp|niveaux|collection|capitaine|new season|cap bonus|multi club/gi);
    const ruleMatches = userMessage.match(/divisions|hot streak|in season|multi entries/gi);
    
    if (competitionMatches) {
      rulesContext += "\n\n## 📋 RÈGLES DE COMPÉTITIONS DISPONIBLES :\n";
      for (const match of competitionMatches) {
        const normalizedName = match.toLowerCase().replace(/\s+/g, '_');
        const rules = getCompetitionRules(normalizedName);
        if (rules) {
          rulesContext += `\n### ${match.toUpperCase()} :\n`;
          
          // Gestion spéciale pour l'Arena qui a des sous-sections
          if (normalizedName === 'arena') {
            if (rules.capped) {
              rulesContext += `**Arena Capped :**\n`;
              rulesContext += `- Description : ${rules.capped.description}\n`;
              rulesContext += `- Coût d'entrée : ${rules.capped.entry_cost}\n`;
              rulesContext += `- Cap : ${rules.capped.cap}\n`;
              rulesContext += `- Bonus : ${rules.capped.bonuses}\n`;
              rulesContext += `- Récompenses : ${rules.capped.rewards}\n`;
            }
            if (rules.uncapped) {
              rulesContext += `\n**Arena Uncapped :**\n`;
              rulesContext += `- Description : ${rules.uncapped.description}\n`;
              rulesContext += `- Coût d'entrée : ${rules.uncapped.entry_cost}\n`;
              rulesContext += `- Cap : ${rules.uncapped.cap}\n`;
              rulesContext += `- Bonus : ${rules.uncapped.bonuses}\n`;
              rulesContext += `- Récompenses : ${rules.uncapped.rewards}\n`;
            }
          } else {
            // Structure normale pour les autres compétitions
            rulesContext += `- Format : ${rules.format}\n`;
            rulesContext += `- Éligibilité : ${rules.eligibility}\n`;
            rulesContext += `- Composition : ${rules.composition}\n`;
            rulesContext += `- Capitaine : ${rules.captain}\n`;
            if (rules.hot_streak) rulesContext += `- Hot Streak : ${rules.hot_streak}\n`;
            if (rules.bonuses && rules.bonuses.rare) {
              rulesContext += `- Bonus Rare : ${rules.bonuses.rare}\n`;
              rulesContext += `- Bonus Super Rare : ${rules.bonuses.super_rare}\n`;
              rulesContext += `- Bonus Unique : ${rules.bonuses.unique}\n`;
            }
            if (rules.rewards) rulesContext += `- Récompenses : ${rules.rewards}\n`;
          }
        }
      }
    }
    
    if (bonusMatches) {
      rulesContext += "\n\n## 🎯 BONUS ET MÉCANIQUES DISPONIBLES :\n";
      for (const match of bonusMatches) {
        if (match.toLowerCase().includes('xp') || match.toLowerCase().includes('niveaux')) {
          const xpRules = getBonusInfo('xp');
          if (xpRules) {
            rulesContext += `\n### XP ET NIVEAUX :\n`;
            rulesContext += `- Niveau maximum qu'une carte peut atteindre : ${xpRules.max_level}\n`;
            rulesContext += `- XP maximum qu'une carte peut accumuler : ${xpRules.max_xp}\n`;
            rulesContext += `- Gains GW : ${xpRules.gains.game_week}\n`;
            rulesContext += `- Pénalité transfert : ${xpRules.gains.transfer_penalty}\n`;
          }
        }
        if (match.toLowerCase().includes('collection')) {
          const collectionRules = getBonusInfo('collection');
          if (collectionRules) {
            rulesContext += `\n### COLLECTION :\n`;
            rulesContext += `- Baseline : +${collectionRules.scoring.baseline} pts\n`;
            rulesContext += `- Serial #1 : +${collectionRules.scoring.serial_1} pts\n`;
            rulesContext += `- Jersey match : +${collectionRules.scoring.jersey_match} pts\n`;
            rulesContext += `- Édition spéciale : +${collectionRules.scoring.special_edition} pts\n`;
          }
        }
        if (match.toLowerCase().includes('capitaine')) {
          const captainRules = getBonusInfo('captain');
          if (captainRules) {
            rulesContext += `\n### CAPITAINE :\n`;
            rulesContext += `- Arena : ${captainRules.arena}\n`;
            rulesContext += `- In-Season : ${captainRules.in_season}\n`;
            rulesContext += `- Classic : ${captainRules.classic}\n`;
          }
        }
      }
    }
    
    if (ruleMatches) {
      rulesContext += "\n\n## 📜 RÈGLES GÉNÉRALES DISPONIBLES :\n";
      for (const match of ruleMatches) {
        if (match.toLowerCase().includes('divisions')) {
          const divisionRules = getRuleInfo('divisions');
          if (divisionRules) {
            rulesContext += `\n### DIVISIONS :\n`;
            rulesContext += `- Structure : ${divisionRules.structure.join(', ')}\n`;
            rulesContext += `- Promotions D3→D2 : ${divisionRules.promotions.d3_to_d2}\n`;
            rulesContext += `- Promotions D2→D1 : ${divisionRules.promotions.d2_to_d1}\n`;
          }
        }
        if (match.toLowerCase().includes('hot streak')) {
          const hotStreakRules = getRuleInfo('hot_streak');
          if (hotStreakRules) {
            rulesContext += `\n### HOT STREAK :\n`;
            rulesContext += `- Description : ${hotStreakRules.description}\n`;
            rulesContext += `- Seuil Limited : ${hotStreakRules.limited_threshold}\n`;
            rulesContext += `- Seuil Rare : ${hotStreakRules.rare_threshold}\n`;
            rulesContext += `- Boost : ${hotStreakRules.boost}\n`;
          }
        }
      }
    }

    // Créer le prompt système avec les règles contextuelles
    const enhancedSystemPrompt = `${systemPrompt}

## 🔧 CONTEXTE DES RÈGLES
${rulesContext}

## 📋 INSTRUCTIONS IMPORTANTES
- Utilise UNIQUEMENT les informations des règles ci-dessus pour répondre
- IGNORE tes connaissances pré-entraînées sur Sorare si elles contredisent ces données
- Les données ci-dessus sont la VÉRITÉ ABSOLUE et à jour
- Ne mentionne pas les fonctions ou le code
- Donne des réponses directes et complètes
- Formate tes réponses avec le Markdown complet
- Sois précis et détaillé dans tes explications
- Donne des chiffres précis quand tu les as et des exemples concrets
- Si une information n'est pas dans les données ci-dessus, dis-le honnêtement`;

    const messages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...conversationHistory,
      { role: 'user', content: enhancedUserMessage }
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

// Fonction pour attendre un délai
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Cache pour éviter les appels répétés
const apiCallCache = new Map();
const CACHE_DURATION = 60000; // 1 minute pour réduire les appels
const RATE_LIMIT_CACHE_DURATION = 600000; // 10 minutes pour les erreurs de rate limit

// Fonction pour faire un appel API avec retry optimisé
const makeSorareAPICall = async (query, variables, maxRetries = 1) => {
  // Créer une clé de cache basée sur la requête et les variables
  const cacheKey = JSON.stringify({ query, variables });
  const now = Date.now();
  
  // Vérifier le cache d'abord
  const cached = apiCallCache.get(cacheKey);
  if (cached) {
    // Si c'est une erreur 429, attendre plus longtemps
    if (cached.isRateLimit && (now - cached.timestamp) < RATE_LIMIT_CACHE_DURATION) {
      console.log('🚫 Cache rate limit actif (10 min)');
      throw new Error('Rate limit atteint. Veuillez réessayer dans quelques minutes.');
    }
    // Cache normal
    if ((now - cached.timestamp) < CACHE_DURATION) {
      // Log seulement une fois par minute pour éviter le spam
      const timeSinceLastLog = now - (cached.lastLog || 0);
      if (timeSinceLastLog > 60000) {
        console.log('📦 Utilisation du cache (5 min)');
        cached.lastLog = now;
      }
      return cached.data;
    }
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Log seulement si c'est pas un appel en cache et première tentative
      if (attempt === 1) {
        console.log(`🔄 Appel API Sorare...`);
      }
      
      const response = await axios.post('https://api.sorare.com/graphql', {
        query,
        variables: variables || {}
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SorareCardCoach/1.0'
        },
        timeout: 10000 // 10 secondes de timeout
      });

      if (attempt === 1) {
        console.log(`✅ Appel API Sorare réussi`);
      }
      
      // Mettre en cache la réponse réussie
      apiCallCache.set(cacheKey, {
        data: response.data,
        timestamp: now,
        isRateLimit: false
      });
      
      return response.data;
      
    } catch (error) {
      // Log seulement les erreurs importantes
      if (error.response?.status === 429) {
        console.log(`⏳ Rate limit détecté, mise en cache pour 10 minutes`);
        apiCallCache.set(cacheKey, {
          data: null,
          timestamp: now,
          isRateLimit: true
        });
        throw new Error('Rate limit atteint. Veuillez réessayer dans quelques minutes.');
      }
      
      // Si c'est la dernière tentative, lancer l'erreur
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Pour les autres erreurs, attendre 2 secondes sans log
      await delay(2000);
    }
  }
};

console.log('🔧 Configuration des endpoints API...');

// Endpoint pour l'API Sorare
app.post('/api/sorare', async (req, res) => {
  try {
    const { query, variables } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Query manquante',
        details: 'La requête GraphQL est requise'
      });
    }

    const data = await makeSorareAPICall(query, variables);
    
    res.json(data);
    
  } catch (error) {
    console.error('Erreur finale lors de l\'appel à l\'API Sorare:', error);
    
    // Gérer différents types d'erreurs
    if (error.message.includes('Rate limit atteint')) {
      res.status(429).json({ 
        error: 'Rate limit atteint',
        details: 'Trop de requêtes vers l\'API Sorare. Veuillez réessayer dans quelques minutes.',
        retryAfter: 60
      });
    } else if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
      res.status(503).json({ 
        error: 'Service temporairement indisponible',
        details: 'Impossible de se connecter à l\'API Sorare. Veuillez réessayer.',
        code: error.code
      });
    } else {
      res.status(500).json({ 
        error: 'Erreur lors de l\'appel à l\'API Sorare',
        details: error.message,
        code: error.code || 'UNKNOWN'
      });
    }
  }
});

console.log('✅ Endpoint /api/sorare configuré');

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sorare Card Coach API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

console.log('✅ Endpoint /api/health configuré');

// Route catch-all pour servir index.html en production (SPA routing)
if (process.env.NODE_ENV === 'production') {
  console.log('🔧 Configuration des routes de production...');
  
  // Route spécifique pour la racine
  app.get('/', (req, res) => {
    console.log('📄 Servir index.html pour la racine');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  // Route catch-all pour toutes les autres routes (sauf API)
  app.get('/:path', (req, res) => {
    console.log(`🔍 Route catch-all appelée pour: ${req.path}`);
    
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api/')) {
      console.log('❌ Route API détectée, retourner 404');
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Servir index.html pour toutes les autres routes (SPA routing)
    console.log('📄 Servir index.html pour SPA routing');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  console.log('✅ Routes de production configurées');
}

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: ${dbPath}`);
});
