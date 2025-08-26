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

const PLAYER_PERFORMANCE_QUERY = `
  query PlayerPerformance($playerId: String!) {
    player(id: $playerId) {
      id
      displayName
      position
      allSo5Scores(first: 40) {
        nodes {
          score
          game {
            date
          }
        }
      }
      allSo5Appearances(first: 40) {
        nodes {
          game {
            date
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

  console.log('🔍 Début de la requête pour le slug:', slug);
  console.log('📡 URL de l\'API:', SORARE_API_URL);

  try {
    let allCards: import('../types/sorare').SorareCard[] = [];
    let hasNextPage = true;
    let after: string | null = null;
    const pageSize = 20; // Récupérer 20 cartes par page pour réduire la complexité
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

      console.log('📤 Corps de la requête:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(SORARE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Statut de la réponse:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const json: PaginatedSorareApiResponse = await response.json();
      console.log('📦 Réponse JSON reçue');

      if (json.errors && json.errors.length > 0) {
        console.error('❌ Erreurs API:', json.errors);
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
      
      console.log('📊 Cartes récupérées sur cette page:', pageCards.length);
      console.log('📊 Total des cartes récupérées:', allCards.length);

      // Mettre à jour les informations de pagination
      hasNextPage = json.data.user.cards.pageInfo.hasNextPage;
      after = json.data.user.cards.pageInfo.endCursor;

      console.log('🔄 Pagination - hasNextPage:', hasNextPage, 'endCursor:', after);
    }

    console.log('✅ Utilisateur trouvé:', userData.nickname);
    console.log('📊 Nombre total de cartes récupérées:', allCards.length);

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
    console.error('💥 Erreur complète:', error);
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
  console.log('💾 Sauvegarde de', cards.length, 'cartes en base de données');
  
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
      console.log('✅ Carte sauvegardée:', dbCard.displayName);
    } catch (error) {
      console.error('❌ Erreur sauvegarde carte:', error);
    }
  }
}

export async function fetchPlayerPerformance(playerId: string): Promise<PlayerPerformance | null> {
  console.log('🏃 Récupération performance pour le joueur:', playerId);

  try {
    const response = await fetch(SORARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: PLAYER_PERFORMANCE_QUERY,
        variables: { playerId },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'Erreur API Sorare');
    }

    const player = json.data?.player;
    if (!player) {
      return null;
    }

    // Calculer les métriques de performance
    const performance = calculatePerformanceMetrics(player);
    
    // Sauvegarder en base de données
    await fetch(`${BACKEND_URL}/api/performances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performance),
    });
    
    console.log('✅ Performance calculée:', performance.displayName);
    return performance;
  } catch (error) {
    console.error('❌ Erreur récupération performance:', error);
    return null;
  }
}

function calculatePerformanceMetrics(player: {
  id: string;
  displayName: string;
  position: string;
  allSo5Scores?: { nodes: Array<{ score: number; game: { date: string } }> };
  allSo5Appearances?: { nodes: Array<{ game: { date: string } }> };
}): PlayerPerformance {
  const scores = player.allSo5Scores?.nodes || [];
  const appearances = player.allSo5Appearances?.nodes || [];
  
  // Trier par date (plus récent en premier)
  const sortedScores = scores.sort((a, b) => 
    new Date(b.game.date).getTime() - new Date(a.game.date).getTime()
  );
  
  const sortedAppearances = appearances.sort((a, b) => 
    new Date(b.game.date).getTime() - new Date(a.game.date).getTime()
  );

  // Calculer L5, L15, L40
  const l5 = calculateAverageScore(sortedScores.slice(0, 5));
  const l15 = calculateAverageScore(sortedScores.slice(0, 15));
  const l40 = calculateAverageScore(sortedScores.slice(0, 40));

  // Calculer DNP%
  const totalGames = sortedAppearances.length;
  const gamesPlayed = sortedScores.length;
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

function calculateAverageScore(scores: Array<{ score: number }>): number {
  if (scores.length === 0) return 0;
  
  const validScores = scores.filter(score => score.score !== null && score.score !== undefined);
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((acc, score) => acc + score.score, 0);
  return Math.round((sum / validScores.length) * 100) / 100; // Arrondir à 2 décimales
}

// Fonction pour récupérer les performances depuis la base de données
export async function getPlayerPerformanceFromDB(playerId: string): Promise<PlayerPerformance | undefined> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/performance/${playerId}`);
    if (response.ok) {
      const performance = await response.json();
      return performance || undefined;
    }
  } catch (error) {
    console.error('❌ Erreur récupération performance depuis DB:', error);
  }
  return undefined;
}

// Fonction pour obtenir les statistiques de la base de données
export async function getDatabaseStats(): Promise<{ cards: number; performances: number }> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stats`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('❌ Erreur récupération stats DB:', error);
  }
  return { cards: 0, performances: 0 };
}

// Nouvelles fonctions pour les GameWeeks
export async function fetchGameWeeks(): Promise<GameWeek[]> {
  console.log('📅 Récupération des GameWeeks');
  console.log('🌐 URL utilisée:', SORARE_API_URL);
  console.log('🔧 BACKEND_URL:', BACKEND_URL);

  try {
    const requestBody = {
      query: GAMEWEEKS_QUERY,
    };
    
    console.log('📤 Corps de la requête:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(SORARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Statut de la réponse:', response.status);
    console.log('📥 Headers de la réponse:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur HTTP:', response.status, errorText);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }

    const json: GameWeeksResponse = await response.json();
    console.log('📦 Réponse JSON:', JSON.stringify(json, null, 2));

    if (json.errors && json.errors.length > 0) {
      console.error('❌ Erreurs API:', json.errors);
      throw new Error(json.errors[0]?.message || 'Erreur API Sorare');
    }

    const fixtures = json.so5?.so5Fixtures?.nodes || [];
    console.log('✅ GameWeeks récupérées:', fixtures.length);

    // Convertir les fixtures en GameWeeks avec des informations de base
    const gameWeeks: GameWeek[] = fixtures.map(fixture => {
      // Extraire les dates du slug (ex: "football-30-aug-2-sep-2025")
      const dateMatch = fixture.slug.match(/football-(\d+)-(\w+)-(\d+)-(\w+)-(\d+)/);
      let startDate, endDate;
      if (dateMatch) {
        const [_, startDay, startMonth, endDay, endMonth, year] = dateMatch;
        startDate = `${startDay} ${startMonth} ${year}`;
        endDate = `${endDay} ${endMonth} ${year}`;
      }

      return {
        slug: fixture.slug,
        state: fixture.aasmState,
        startDate,
        endDate,
        leagues: [] // On ne récupère pas les détails pour l'instant
      };
    });

    console.log('✅ GameWeeks converties:', gameWeeks.length);
    return gameWeeks;
  } catch (error) {
    console.error('❌ Erreur récupération GameWeeks:', error);
    return [];
  }
}

export async function fetchGameWeekDetail(slug: string): Promise<GameWeek | null> {
  console.log('📅 Récupération détails GameWeek:', slug);

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
      startDate = `${startDay} ${startMonth} ${year}`;
      endDate = `${endDay} ${endMonth} ${year}`;
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

    console.log('✅ Détails GameWeek récupérés:', gameWeek.slug);
    return gameWeek;
  } catch (error) {
    console.error('❌ Erreur récupération détails GameWeek:', error);
    return null;
  }
}