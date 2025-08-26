// Configuration OpenAI - Version côté client sécurisée
// L'API OpenAI sera appelée via le backend pour éviter l'exposition des clés

// Interface pour les messages
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Système prompt pour le coach Sorare
export const SYSTEM_PROMPT = `Tu es Pep, un coach expert en Sorare, le jeu de fantasy football basé sur les cartes NFT.

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
- Toujours en français

IMPORTANT : Si tu ne sais pas quelque chose, dis-le honnêtement plutôt que d'inventer.`;

// Fonction pour appeler l'API OpenAI via le backend
export async function callOpenAI(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        conversationHistory: conversationHistory.slice(-8), // Garder les 8 derniers messages (4 échanges)
        systemPrompt: SYSTEM_PROMPT
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
