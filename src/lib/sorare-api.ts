import { SorareApiResponse, PaginatedSorareApiResponse, PlayerPerformance, GameWeeksResponse, GameWeekDetailResponse, GameWeek } from '../types/sorare';

// Utilisation du serveur backend
const BACKEND_URL = 'http://localhost:3001';
const SORARE_API_URL = `${BACKEND_URL}/api/sorare`;

const CARDS_QUERY = `
  query MyCards($slug: String!, $first: Int!, $after: String) {
    user(slug: $slug) {
      id
      slug
      nickname
      cards(first: $first, after: $after, sport: FOOTBALL, owned: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Card {
            id
            slug
            rarity
            xp
            season { startYear }
            player {
              id
              position
              activeClub {
                name
                domesticLeague {
                  name
                }
              }
              lastFifteenSo5Appearances
              avgAsDef: averageScore(position: Defender, type: LAST_FIFTEEN_SO5_AVERAGE_SCORE)
              avgAsMid: averageScore(position: Midfielder, type: LAST_FIFTEEN_SO5_AVERAGE_SCORE)
              avgAsFwd: averageScore(position: Forward, type: LAST_FIFTEEN_SO5_AVERAGE_SCORE)
              avgAsGK: averageScore(position: Goalkeeper, type: LAST_FIFTEEN_SO5_AVERAGE_SCORE)
              displayName
              age
            }
          }
        }
      }
    }
  }
`;



const GAMEWEEKS_QUERY = `
  query GameWeeks {
    so5 {
      so5Fixtures {
        nodes {
          aasmState
          slug
        }
      }
    }
  }
`;

const GAMEWEEK_DETAIL_QUERY = `
  query GameWeekDetail($slug: String!) {
    so5 {
      so5Fixture(slug: $slug) {
        aasmState
        slug
        so5Leaderboards {
          so5League {
            displayName
          }
          rarityType
          division
        }
      }
    }
  }
`;

export async function fetchUserCards(slug: string): Promise<SorareApiResponse['data']> {
  if (!slug.trim()) {
    throw new Error('Le slug Sorare est requis');
  }

  try {
    let allCards: import('../types/sorare').SorareCard[] = [];
    let hasNextPage = true;
    let after: string | null = null;
    const pageSize = 20;
    let userData: { id: string; slug: string; nickname: string } | null = null;

    while (hasNextPage) {
      const requestBody = {
        query: CARDS_QUERY,
        variables: { 
          slug: slug.trim(),
          first: pageSize,
          after: after
        },
      };

      const response = await fetch(SORARE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const json: PaginatedSorareApiResponse = await response.json();

      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0]?.message || 'Erreur API Sorare');
      }

      if (!json.data?.user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Sauvegarder les données utilisateur de la première page
      if (!userData) {
        userData = {
          id: json.data.user.id,
          slug: json.data.user.slug,
          nickname: json.data.user.nickname
        };
      }

      // Ajouter les cartes de cette page à la liste totale
      const pageCards = json.data.user.cards.nodes;
      allCards = allCards.concat(pageCards);

      // Mettre à jour les informations de pagination
      hasNextPage = json.data.user.cards.pageInfo.hasNextPage;
      after = json.data.user.cards.pageInfo.endCursor;
    }

    // Sauvegarder toutes les cartes en base de données
    await saveCardsToDatabase(allCards);

    // Retourner les données avec toutes les cartes
    return {
      user: {
        ...userData,
        cards: {
          nodes: allCards
        }
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur de connexion à l\'API Sorare');
  }
}

// Fonction pour calculer les performances à partir des données des cartes
export function calculatePlayerPerformanceFromCard(card: import('../types/sorare').SorareCard): PlayerPerformance | null {
  if (!card.player) return null;

  const player = card.player;
  
  // Récupérer le score L15 selon la position du joueur
  let l15 = 0;
  switch (player.position) {
    case 'Forward':
      l15 = player.avgAsFwd || 0;
      break;
    case 'Defender':
      l15 = player.avgAsDef || 0;
      break;
    case 'Midfielder':
      l15 = player.avgAsMid || 0;
      break;
    case 'Goalkeeper':
      l15 = player.avgAsGK || 0;
      break;
    default:
      l15 = player.avgAsFwd || player.avgAsMid || player.avgAsDef || player.avgAsGK || 0;
  }

  // Pour l'instant, on utilise seulement L15 car c'est ce que l'API nous donne directement
  const l5 = 0; // À implémenter si nécessaire
  const l40 = 0; // À implémenter si nécessaire

  // Calculer DNP% basé sur lastFifteenSo5Appearances
  // Si le joueur a 15 apparitions, il a joué tous ses matchs (DNP% = 0)
  // Si il a moins de 15 apparitions, on calcule le pourcentage de matchs manqués
  const totalGames = 15; // On considère les 15 derniers matchs
  const gamesPlayed = player.lastFifteenSo5Appearances || 0;
  const dnpPercentage = totalGames > 0 ? ((totalGames - gamesPlayed) / totalGames) * 100 : 0;

  return {
    playerId: player.id,
    displayName: player.displayName,
    position: player.position,
    l5,
    l15,
    l40,
    dnpPercentage,
    gamesPlayed,
    totalGames
  };
}

async function saveCardsToDatabase(cards: import('../types/sorare').SorareCard[]) {
  for (const card of cards) {
    const dbCard = {
      id: card.id,
      slug: card.slug,
      playerId: card.player.id,
      displayName: card.player.displayName,
      position: card.player.position,
      rarity: card.rarity,
      xp: card.xp,
      season: card.season?.startYear || new Date().getFullYear(),
      lastUpdated: new Date().toISOString()
    };

    try {
      await fetch(`${BACKEND_URL}/api/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbCard),
      });
    } catch (error) {
      console.error('Erreur sauvegarde carte:', error);
    }
  }
}

// Fonction pour obtenir les statistiques de la base de données
export async function getDatabaseStats(): Promise<{ cards: number; performances: number }> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stats`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erreur récupération stats DB:', error);
  }
  return { cards: 0, performances: 0 };
}

// Nouvelles fonctions pour les GameWeeks
export async function fetchGameWeeks(): Promise<GameWeek[]> {
  try {
    console.log('Début fetchGameWeeks');
    const response = await fetch(SORARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GAMEWEEKS_QUERY,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }

    const json: GameWeeksResponse = await response.json();
    console.log('Réponse API reçue:', JSON.stringify(json, null, 2));

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'Erreur API Sorare');
    }

    const fixtures = json.data?.so5?.so5Fixtures?.nodes || json.so5?.so5Fixtures?.nodes || [];
    console.log('Fixtures trouvées:', fixtures.length);

    // Convertir les fixtures en GameWeeks avec des informations de base
    const gameWeeks: GameWeek[] = fixtures.map(fixture => {
      // Extraire les dates du slug (ex: "football-30-aug-2-sep-2025")
      const dateMatch = fixture.slug.match(/football-(\d+)-(\w+)-(\d+)-(\w+)-(\d+)/);
      let startDate, endDate;
      if (dateMatch) {
        const [_, startDay, startMonth, endDay, endMonth, year] = dateMatch;
        
        // Convertir les mois en anglais vers des numéros
        const monthMap: { [key: string]: string } = {
          'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
          'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
          'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
        };
        
        const startMonthNum = monthMap[startMonth.toLowerCase()] || '01';
        const endMonthNum = monthMap[endMonth.toLowerCase()] || '01';
        
        startDate = `${year}-${startMonthNum}-${startDay.padStart(2, '0')}`;
        endDate = `${year}-${endMonthNum}-${endDay.padStart(2, '0')}`;
      }

      return {
        slug: fixture.slug,
        state: fixture.aasmState,
        startDate,
        endDate,
        leagues: [] // On ne récupère pas les détails pour l'instant
      };
    });

    console.log('GameWeeks converties:', gameWeeks.length);
    return gameWeeks;
  } catch (error) {
    console.error('Erreur récupération GameWeeks:', error);
    return [];
  }
}

export async function fetchGameWeekDetail(slug: string): Promise<GameWeek | null> {
  try {
    const response = await fetch(SORARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GAMEWEEK_DETAIL_QUERY,
        variables: { slug },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const json: GameWeekDetailResponse = await response.json();

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'Erreur API Sorare');
    }

    const fixture = json.so5?.so5Fixture;
    if (!fixture) {
      return null;
    }

    // Extraire les dates du slug (ex: "football-30-aug-2-sep-2025")
    const dateMatch = slug.match(/football-(\d+)-(\w+)-(\d+)-(\w+)-(\d+)/);
    let startDate, endDate;
    if (dateMatch) {
      const [_, startDay, startMonth, endDay, endMonth, year] = dateMatch;
      
      // Convertir les mois en anglais vers des numéros
      const monthMap: { [key: string]: string } = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
      };
      
      const startMonthNum = monthMap[startMonth.toLowerCase()] || '01';
      const endMonthNum = monthMap[endMonth.toLowerCase()] || '01';
      
      startDate = `${year}-${startMonthNum}-${startDay.padStart(2, '0')}`;
      endDate = `${year}-${endMonthNum}-${endDay.padStart(2, '0')}`;
    }

    const gameWeek: GameWeek = {
      slug: fixture.slug,
      state: fixture.aasmState,
      startDate,
      endDate,
      leagues: fixture.so5Leaderboards.map(leaderboard => ({
        name: leaderboard.so5League.displayName,
        rarity: leaderboard.rarityType,
        division: leaderboard.division
      }))
    };

    return gameWeek;
  } catch (error) {
    console.error('Erreur récupération détails GameWeek:', error);
    return null;
  }
}