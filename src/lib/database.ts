import Database from 'better-sqlite3';
import { DatabaseCard, PlayerPerformance } from '../types/sorare';
import path from 'path';

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'sorare-cards.db');
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  private initDatabase() {
    // Table pour les cartes
    this.db.exec(`
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

    // Table pour les performances des joueurs
    this.db.exec(`
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

    // Index pour améliorer les performances
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_cards_playerId ON cards(playerId);
      CREATE INDEX IF NOT EXISTS idx_cards_rarity ON cards(rarity);
      CREATE INDEX IF NOT EXISTS idx_cards_position ON cards(position);
    `);
  }

  // Méthodes pour les cartes
  saveCard(card: DatabaseCard) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO cards 
      (id, slug, playerId, displayName, position, rarity, xp, season, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      card.id,
      card.slug,
      card.playerId,
      card.displayName,
      card.position,
      card.rarity,
      card.xp,
      card.season,
      card.lastUpdated
    );
  }

  getCard(id: string): DatabaseCard | undefined {
    const stmt = this.db.prepare('SELECT * FROM cards WHERE id = ?');
    return stmt.get(id) as DatabaseCard | undefined;
  }

  getAllCards(): DatabaseCard[] {
    const stmt = this.db.prepare('SELECT * FROM cards ORDER BY lastUpdated DESC');
    return stmt.all() as DatabaseCard[];
  }

  getCardsByPlayer(playerId: string): DatabaseCard[] {
    const stmt = this.db.prepare('SELECT * FROM cards WHERE playerId = ?');
    return stmt.all(playerId) as DatabaseCard[];
  }

  // Méthodes pour les performances
  savePlayerPerformance(performance: PlayerPerformance) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO player_performances 
      (playerId, displayName, position, l5, l15, l40, dnpPercentage, gamesPlayed, totalGames, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      performance.playerId,
      performance.displayName,
      performance.position,
      performance.l5,
      performance.l15,
      performance.l40,
      performance.dnpPercentage,
      performance.gamesPlayed,
      performance.totalGames,
      new Date().toISOString()
    );
  }

  getPlayerPerformance(playerId: string): PlayerPerformance | undefined {
    const stmt = this.db.prepare('SELECT * FROM player_performances WHERE playerId = ?');
    return stmt.get(playerId) as PlayerPerformance | undefined;
  }

  getAllPlayerPerformances(): PlayerPerformance[] {
    const stmt = this.db.prepare('SELECT * FROM player_performances ORDER BY lastUpdated DESC');
    return stmt.all() as PlayerPerformance[];
  }

  // Méthodes utilitaires
  getDatabaseStats() {
    const cardCount = this.db.prepare('SELECT COUNT(*) as count FROM cards').get() as { count: number };
    const performanceCount = this.db.prepare('SELECT COUNT(*) as count FROM player_performances').get() as { count: number };
    
    return {
      cards: cardCount.count,
      performances: performanceCount.count
    };
  }

  close() {
    this.db.close();
  }
}

// Instance singleton
export const databaseService = new DatabaseService();

