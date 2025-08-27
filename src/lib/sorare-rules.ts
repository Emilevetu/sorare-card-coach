// Fonctions pour accéder aux règles Sorare via l'API backend

export interface SorareRule {
  [key: string]: any;
}

export interface CompetitionRule {
  format: string;
  eligibility: string;
  composition: string;
  captain: string;
  hot_streak?: string;
  bonuses: {
    rare: string;
    super_rare: string;
    unique: string;
  };
  divisions?: string[];
  rewards?: string;
}

export interface BonusRule {
  [key: string]: any;
}

export interface RuleInfo {
  [key: string]: any;
}

// Fonction générique pour appeler l'API des règles
const callRulesAPI = async (type: string, name: string, subType?: string): Promise<any> => {
  try {
    const params = new URLSearchParams({ type, name });
    if (subType) {
      params.append('subType', subType);
    }
    
    const response = await fetch(`http://localhost:3001/api/sorare-rules?${params}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Erreur API règles:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel aux règles:', error);
    return null;
  }
};

// Fonctions pour les compétitions
export const getCompetitionRules = async (competitionName: string): Promise<CompetitionRule | null> => {
  return callRulesAPI('competition', competitionName);
};

// Fonctions pour les bonus
export const getBonusInfo = async (bonusType: string, subType?: string): Promise<BonusRule | null> => {
  return callRulesAPI('bonus', bonusType, subType);
};

// Fonctions pour les règles générales
export const getRuleInfo = async (ruleType: string, subType?: string): Promise<RuleInfo | null> => {
  return callRulesAPI('rule', ruleType, subType);
};

// Fonctions pour les listes
export const getAllCompetitions = async (): Promise<string[] | null> => {
  return callRulesAPI('list', 'competitions');
};

export const getAllBonuses = async (): Promise<string[] | null> => {
  return callRulesAPI('list', 'bonuses');
};

// Fonctions utilitaires pour formater les réponses
export const formatCompetitionRules = (rules: CompetitionRule): string => {
  if (!rules) return "Règles non trouvées";
  
  return `**${rules.format}** - ${rules.eligibility}
  
**Composition :** ${rules.composition}
**Capitaine :** ${rules.captain}
${rules.hot_streak ? `**Hot Streak :** ${rules.hot_streak}` : ''}

**Bonus par rareté :**
• Rare : ${rules.bonuses.rare}
• Super Rare : ${rules.bonuses.super_rare}
• Unique : ${rules.bonuses.unique}
${rules.rewards ? `\n**Récompenses :** ${rules.rewards}` : ''}`;
};

export const formatXPLevels = (levels: any): string => {
  if (!levels) return "Niveaux XP non trouvés";
  
  let result = "**Niveaux XP :**\n\n";
  
  Object.entries(levels).forEach(([level, data]: [string, any]) => {
    result += `**Niveau ${level} :** ${data.bonus} (${data.xp_required} XP, cooldown: ${data.cooldown})\n`;
  });
  
  return result;
};

export const formatCollectionScoring = (scoring: any): string => {
  if (!scoring) return "Scoring collection non trouvé";
  
  return `**Scoring Collection :**
• Baseline : +${scoring.baseline} pts
• Serial #1 : +${scoring.serial_1} pts
• Jersey match : +${scoring.jersey_match} pts
• Édition spéciale : +${scoring.special_edition} pts
• One-owner : +${scoring.one_owner} pts
• Non listée 30j : +${scoring.non_listed_30d} pts`;
};
