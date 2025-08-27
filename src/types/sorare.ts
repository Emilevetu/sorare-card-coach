export interface GameScore {
  score: number;
}

export interface SorarePlayer {
  id: string;
  slug: string;
  displayName: string;
  position: string;
  age: number;
  lastFifteenSo5Appearances?: number;
  avgAsDef?: number;
  avgAsMid?: number;
  avgAsFwd?: number;
  avgAsGK?: number;
  activeClub?: {
    name: string;
    domesticLeague?: {
      name: string;
    };
  };
  u23Eligible: boolean;
  rawPlayerGameScores?: number[];
}

export interface SorareCard {
  id: string;
  slug: string;
  rarity: string;
  xp: number;
  season: {
    startYear: number;
  };
  player: SorarePlayer;
}

export interface SorareUser {
  id: string;
  slug: string;
  nickname: string;
  cards: {
    nodes: SorareCard[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export interface SorareResponse {
  user: SorareUser | null;
}

export interface SorareApiResponse {
  data: SorareResponse;
  errors?: Array<{ message: string }>;
}

export interface PaginatedSorareApiResponse {
  data: {
    user: {
      id: string;
      slug: string;
      nickname: string;
      cards: {
        nodes: SorareCard[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export interface PlayerPerformance {
  playerId: string;
  displayName: string;
  position: string;
  l5: number;
  l15: number;
  l40: number;
  dnpPercentage: number;
  gamesPlayed: number;
  totalGames: number;
}

export interface CardWithPerformance extends SorareCard {
  performance?: PlayerPerformance;
}

export interface GameWeek {
  slug: string;
  state: string;
  startDate?: string;
  endDate?: string;
  leagues: Array<{
    name: string;
    rarity: string;
    division: string;
  }>;
}

export interface GameWeeksResponse {
  data?: {
    so5?: {
      so5Fixtures?: {
        nodes: Array<{
          aasmState: string;
          slug: string;
        }>;
      };
    };
  };
  so5?: {
    so5Fixtures?: {
      nodes: Array<{
        aasmState: string;
        slug: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export interface GameWeekDetailResponse {
  data?: {
    so5?: {
      so5Fixture?: {
        aasmState: string;
        slug: string;
        so5Leaderboards: Array<{
          so5League: {
            displayName: string;
          };
          rarityType: string;
          division: string;
        }>;
      };
    };
  };
  so5?: {
    so5Fixture?: {
      aasmState: string;
      slug: string;
      so5Leaderboards: Array<{
        so5League: {
          displayName: string;
        };
        rarityType: string;
        division: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export type RarityFilter = 'All' | 'Limited' | 'Rare' | 'Super Rare' | 'Unique';
export type PositionFilter = 'All' | 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
export type AgeFilter = 'All' | '-23 ans' | 'Over23';
export type LeagueFilter = 'All' | string;
export type SeasonFilter = 'All' | string;
export type SortField = 'xp' | 'season' | 'position' | 'age' | 'league' | 'rarity' | 'l15' | 'dnp';
export type SortDirection = 'asc' | 'desc';