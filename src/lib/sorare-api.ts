import { SorareApiResponse } from '../types/sorare';

const SORARE_API_URL = 'https://api.sorare.com/graphql';

const CARDS_QUERY = `
  query MyCards($slug: String!) {
    user(slug: $slug) {
      id
      slug
      nickname
      cards(first: 50, sport: FOOTBALL, owned: true) {
        nodes {
          ... on Card {
            id
            slug
            rarity
            xp
            season { startYear }
            player {
              displayName
              position
              age
              activeClub { name }
              u23Eligible
            }
          }
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
    const response = await fetch(SORARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CARDS_QUERY,
        variables: { slug: slug.trim() },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const json: SorareApiResponse = await response.json();

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'Erreur API Sorare');
    }

    return json.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur de connexion à l\'API Sorare');
  }
}