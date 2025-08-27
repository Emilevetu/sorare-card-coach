const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3001';
const SORARE_API_URL = `${BACKEND_URL}/api/sorare`;

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

async function fetchGameWeeks() {
  try {
    console.log('🔄 Récupération des GameWeeks...');
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const json = await response.json();
    console.log('✅ GameWeeks récupérées:', json.data?.so5?.so5Fixtures?.nodes?.length || 0);
    
    return json.data?.so5?.so5Fixtures?.nodes || [];
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return [];
  }
}

async function fetchGameWeekDetail(slug) {
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

    const json = await response.json();
    return json.data?.so5?.so5Fixture;
  } catch (error) {
    console.error(`❌ Erreur pour ${slug}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Début de la récupération des vraies GameWeeks...\n');
  
  const gameWeeks = await fetchGameWeeks();
  
  // Filtrer les GameWeeks récentes (août-septembre 2025)
  const recentGameWeeks = gameWeeks.slice(0, 10); // Prendre les 10 premières
  
  console.log(`📅 GameWeeks trouvées: ${recentGameWeeks.length}\n`);
  
  for (const gw of recentGameWeeks) {
    console.log(`🔍 Récupération des détails pour: ${gw.slug}`);
    const detail = await fetchGameWeekDetail(gw.slug);
    
    if (detail) {
      console.log(`✅ ${gw.slug} (${detail.aasmState})`);
      console.log(`   Compétitions: ${detail.so5Leaderboards?.length || 0}`);
      
      if (detail.so5Leaderboards) {
        const leagues = detail.so5Leaderboards.map(lb => ({
          name: lb.so5League.displayName,
          rarity: lb.rarityType,
          division: lb.division
        }));
        
        // Optimiser les compétitions Arena
        const arenaMap = new Map();
        const otherCompetitions = [];
        
        for (const league of leagues) {
          if (league.name.includes('Arena')) {
            const key = `${league.name}_${league.rarity}`;
            if (!arenaMap.has(key)) {
              arenaMap.set(key, {
                name: league.name,
                rarity: league.rarity,
                division: 'All'
              });
            }
          } else {
            otherCompetitions.push(league);
          }
        }
        
        const optimizedLeagues = [...arenaMap.values(), ...otherCompetitions];
        console.log(`   Compétitions optimisées: ${leagues.length} → ${optimizedLeagues.length}`);
        
        // Afficher quelques exemples
        optimizedLeagues.slice(0, 5).forEach(league => {
          console.log(`     - ${league.name} (${league.rarity}) Div.${league.division}`);
        });
        if (optimizedLeagues.length > 5) {
          console.log(`     ... et ${optimizedLeagues.length - 5} autres`);
        }
      }
    } else {
      console.log(`❌ Échec pour ${gw.slug}`);
    }
    console.log('');
    
    // Pause pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🏁 Récupération terminée !');
}

main().catch(console.error);
