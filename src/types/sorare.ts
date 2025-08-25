export interface SorarePlayer {
  displayName: string;
  position: string;
  age: number;
  activeClub: {
    name: string;
  } | null;
  u23Eligible: boolean;
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
  };
}

export interface SorareResponse {
  user: SorareUser | null;
}

export interface SorareApiResponse {
  data: SorareResponse;
  errors?: Array<{ message: string }>;
}

export type RarityFilter = 'All' | 'Limited' | 'Rare' | 'Super Rare' | 'Unique';
export type SortField = 'xp' | 'season';
export type SortDirection = 'asc' | 'desc';