// Configuration OpenAI - Version côté client sécurisée
// L'API OpenAI sera appelée via le backend pour éviter l'exposition des clés

// Interface pour les messages
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Fonction pour générer le prompt système avec les cartes utilisateur
export function generateSystemPrompt(userCards?: UserCard[]): string {
  let basePrompt = `Tu es Pep, un coach expert en Sorare, le jeu de fantasy football basé sur les cartes NFT.

TON RÔLE :
- Analyser les performances des joueurs et des cartes
- Donner des conseils stratégiques pour les compositions
- Expliquer les mécaniques du jeu (L15, DNP%, bonus, etc.)
- Aider à optimiser les lineups selon les compétitions
- Répondre aux questions sur les raretés (Limited, Rare, Super Rare, Unique)

TES CONNAISSANCES :
- Statistiques de performance (L15 = moyenne sur 15 derniers matchs)
- Calculs DNP% (Did Not Play percentage)
- Différentes compétitions et leurs spécificités
- Stratégies de bonus et de cap
- Analyse des cartes par position (Attaquant, Milieu, Défenseur, Gardien)

TON STYLE :
- Réponses claires et concises
- Explications pédagogiques
- Conseils pratiques et actionnables
- Ton amical et encourageant
- Toujours en français`;

  // Ajouter les cartes de l'utilisateur si disponibles
  if (userCards && userCards.length > 0) {
    basePrompt += `\n\nCARTES DE L'UTILISATEUR (${userCards.length} cartes) :
Tu as accès aux cartes suivantes de l'utilisateur. Utilise ces informations pour donner des conseils personnalisés :

${userCards.map((card, index) => `
${index + 1}. ${card.player.displayName} (${card.player.position})
   - Rareté: ${card.rarity}
   - XP: ${card.xp}
   - Saison: ${card.season.startYear}
   - Âge: ${card.player.age || 'N/A'}
   - Club: ${card.player.activeClub?.name || 'N/A'}
   - Ligue: ${card.player.activeClub?.domesticLeague?.name || 'N/A'}
   - L15: ${card.player.lastFifteenSo5Appearances || 'N/A'} matchs
   - Scores moyens: DEF=${card.player.avgAsDef || 'N/A'}, MID=${card.player.avgAsMid || 'N/A'}, FWD=${card.player.avgAsFwd || 'N/A'}, GK=${card.player.avgAsGK || 'N/A'}
`).join('')}

Utilise ces informations pour :
- Analyser les forces et faiblesses de la collection
- Suggérer des compositions optimales
- Identifier les cartes à améliorer ou remplacer
- Donner des conseils stratégiques personnalisés`;
  }

  basePrompt += `\n\nIMPORTANT : Si tu ne sais pas quelque chose, dis-le honnêtement plutôt que d'inventer.`;
  
  return basePrompt;
}

// Interface pour les cartes utilisateur
export interface UserCard {
  id: string;
  slug: string;
  rarity: string;
  xp: number;
  season: { startYear: number };
  player: {
    id: string;
    position: string;
    lastFifteenSo5Appearances?: number;
    avgAsDef?: number;
    avgAsMid?: number;
    avgAsFwd?: number;
    avgAsGK?: number;
    displayName: string;
    age?: number;
    activeClub?: { name: string; domesticLeague?: { name: string } };
  };
}

// Fonction pour appeler l'API OpenAI via le backend
export async function callOpenAI(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userCards?: UserCard[]
): Promise<string> {
  try {
    const response = await fetch('http://localhost:3001/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        conversationHistory: conversationHistory.slice(-8), // Garder les 8 derniers messages (4 échanges)
        systemPrompt: generateSystemPrompt(userCards)
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'Désolé, je n\'ai pas pu générer de réponse.';
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return 'Désolé, une erreur s\'est produite lors de la communication avec l\'IA.';
  }
}
