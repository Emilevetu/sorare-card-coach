const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

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

// Proxy vers l'API Sorare
app.post('/api/sorare', async (req, res) => {
  try {
    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: ${dbPath}`);
});
