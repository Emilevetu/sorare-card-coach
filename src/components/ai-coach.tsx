import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameWeek } from '@/types/sorare';
import { callOpenAI, ChatMessage, UserCard } from '@/lib/openai-config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AICoachProps {
  gameWeeks: GameWeek[];
  userCards?: UserCard[];
  onRecommendationGenerated?: (recommendation: string) => void;
}

export function AICoach({ gameWeeks, userCards, onRecommendationGenerated }: AICoachProps) {
  // Données de GameWeeks hardcodées avec les vraies données de l'API Sorare (complètes)
  const HARDCODED_GAMEWEEKS: GameWeek[] = [
    {
      slug: 'football-9-12-sep-2025',
      state: 'opened',
      startDate: '2025-09-09',
      endDate: '2025-09-12',
      leagues: [
        { name: 'Arena', rarity: 'limited', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'limited', division: 'All' },
        { name: 'Arena', rarity: 'rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'rare', division: 'All' },
        { name: 'Arena', rarity: 'super_rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'super_rare', division: 'All' },
        { name: 'Arena', rarity: 'unique', division: 'All' },
        { name: 'All Star', rarity: 'limited', division: '1' },
        { name: 'Under 23', rarity: 'limited', division: '1' },
        { name: 'All Star', rarity: 'limited', division: '2' },
        { name: 'Under 23', rarity: 'limited', division: '2' },
        { name: 'All Star', rarity: 'limited', division: '3' },
        { name: 'Under 23', rarity: 'limited', division: '3' },
        { name: 'All Star', rarity: 'rare', division: '1' },
        { name: 'Under 23', rarity: 'rare', division: '1' },
        { name: 'All Star', rarity: 'rare', division: '2' },
        { name: 'Under 23', rarity: 'rare', division: '2' },
        { name: 'All Star', rarity: 'rare', division: '3' },
        { name: 'Under 23', rarity: 'rare', division: '3' },
        { name: 'All Star', rarity: 'super_rare', division: '1' },
        { name: 'Under 23', rarity: 'super_rare', division: '1' },
        { name: 'All Star', rarity: 'unique', division: '1' },
        { name: 'Under 23', rarity: 'unique', division: '1' },
      ]
    },
    {
      slug: 'football-5-9-sep-2025',
      state: 'opened',
      startDate: '2025-09-05',
      endDate: '2025-09-09',
      leagues: [
        { name: 'Arena', rarity: 'limited', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'limited', division: 'All' },
        { name: 'Arena', rarity: 'rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'rare', division: 'All' },
        { name: 'Arena', rarity: 'super_rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'super_rare', division: 'All' },
        { name: 'Arena', rarity: 'unique', division: 'All' },
        { name: 'All Star', rarity: 'limited', division: '1' },
        { name: 'Under 23', rarity: 'limited', division: '1' },
        { name: 'All Star', rarity: 'limited', division: '2' },
        { name: 'Under 23', rarity: 'limited', division: '2' },
        { name: 'All Star', rarity: 'limited', division: '3' },
        { name: 'Under 23', rarity: 'limited', division: '3' },
        { name: 'All Star', rarity: 'rare', division: '1' },
        { name: 'Under 23', rarity: 'rare', division: '1' },
        { name: 'All Star', rarity: 'rare', division: '2' },
        { name: 'Under 23', rarity: 'rare', division: '2' },
        { name: 'All Star', rarity: 'rare', division: '3' },
        { name: 'Under 23', rarity: 'rare', division: '3' },
        { name: 'All Star', rarity: 'super_rare', division: '1' },
        { name: 'Under 23', rarity: 'super_rare', division: '1' },
        { name: 'All Star', rarity: 'unique', division: '1' },
        { name: 'Under 23', rarity: 'unique', division: '1' },
      ]
    },
    {
      slug: 'football-4-5-sep-2025',
      state: 'opened',
      startDate: '2025-09-04',
      endDate: '2025-09-05',
      leagues: [
        { name: 'Arena', rarity: 'limited', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'limited', division: 'All' },
        { name: 'Arena', rarity: 'rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'rare', division: 'All' },
        { name: 'Arena', rarity: 'super_rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'super_rare', division: 'All' },
        { name: 'Arena', rarity: 'unique', division: 'All' },
        { name: 'All Star', rarity: 'limited', division: '1' },
        { name: 'Under 23', rarity: 'limited', division: '1' },
        { name: 'All Star', rarity: 'limited', division: '2' },
        { name: 'Under 23', rarity: 'limited', division: '2' },
        { name: 'All Star', rarity: 'limited', division: '3' },
        { name: 'Under 23', rarity: 'limited', division: '3' },
        { name: 'All Star', rarity: 'rare', division: '1' },
        { name: 'Under 23', rarity: 'rare', division: '1' },
        { name: 'All Star', rarity: 'rare', division: '2' },
        { name: 'Under 23', rarity: 'rare', division: '2' },
        { name: 'All Star', rarity: 'rare', division: '3' },
        { name: 'Under 23', rarity: 'rare', division: '3' },
        { name: 'All Star', rarity: 'super_rare', division: '1' },
        { name: 'Under 23', rarity: 'super_rare', division: '1' },
        { name: 'All Star', rarity: 'unique', division: '1' },
        { name: 'Under 23', rarity: 'unique', division: '1' },
      ]
    },
    {
      slug: 'football-30-aug-2-sep-2025',
      state: 'opened',
      startDate: '2025-09-01',
      endDate: '2025-09-01',
      leagues: [
        { name: 'Arena Uncapped', rarity: 'limited', division: 'All' },
        { name: 'Arena', rarity: 'limited', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'rare', division: 'All' },
        { name: 'Arena', rarity: 'rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'super_rare', division: 'All' },
        { name: 'Arena', rarity: 'super_rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'unique', division: 'All' },
        { name: 'Arena', rarity: 'unique', division: 'All' },
        { name: 'Premier League', rarity: 'limited', division: '1' },
        { name: 'MLS', rarity: 'limited', division: '1' },
        { name: 'LALIGA EA SPORTS', rarity: 'limited', division: '1' },
        { name: 'Bundesliga', rarity: 'limited', division: '1' },
        { name: 'Jupiler Pro League', rarity: 'limited', division: '1' },
        { name: 'Ligue 1', rarity: 'limited', division: '1' },
        { name: 'Eredivisie', rarity: 'limited', division: '1' },
        { name: 'Challenger', rarity: 'limited', division: '1' },
        { name: 'Contender', rarity: 'limited', division: '1' },
        { name: 'Premier League', rarity: 'limited', division: '2' },
        { name: 'MLS', rarity: 'limited', division: '2' },
        { name: 'LALIGA EA SPORTS', rarity: 'limited', division: '2' },
        { name: 'Bundesliga', rarity: 'limited', division: '2' },
        { name: 'Jupiler Pro League', rarity: 'limited', division: '2' },
        { name: 'Ligue 1', rarity: 'limited', division: '2' },
        { name: 'Eredivisie', rarity: 'limited', division: '2' },
        { name: 'Challenger', rarity: 'limited', division: '2' },
        { name: 'Contender', rarity: 'limited', division: '2' },
        { name: 'Premier League', rarity: 'limited', division: '3' },
        { name: 'MLS', rarity: 'limited', division: '3' },
        { name: 'LALIGA EA SPORTS', rarity: 'limited', division: '3' },
        { name: 'Bundesliga', rarity: 'limited', division: '3' },
        { name: 'Jupiler Pro League', rarity: 'limited', division: '3' },
        { name: 'Ligue 1', rarity: 'limited', division: '3' },
        { name: 'Eredivisie', rarity: 'limited', division: '3' },
        { name: 'Challenger', rarity: 'limited', division: '3' },
        { name: 'Contender', rarity: 'limited', division: '3' },
        { name: 'MLS', rarity: 'limited', division: '1' },
        { name: 'Champion', rarity: 'limited', division: '1' },
        { name: 'All Star', rarity: 'limited', division: '1' },
        { name: 'Under 23', rarity: 'limited', division: '1' },
        { name: 'MLS', rarity: 'limited', division: '2' },
        { name: 'Champion', rarity: 'limited', division: '2' },
        { name: 'All Star', rarity: 'limited', division: '2' },
        { name: 'Under 23', rarity: 'limited', division: '2' },
        { name: 'MLS', rarity: 'limited', division: '3' },
        { name: 'Champion', rarity: 'limited', division: '3' },
        { name: 'All Star', rarity: 'limited', division: '3' },
        { name: 'Under 23', rarity: 'limited', division: '3' },
        { name: 'Premier League', rarity: 'rare', division: '1' },
        { name: 'MLS', rarity: 'rare', division: '1' },
        { name: 'LALIGA EA SPORTS', rarity: 'rare', division: '1' },
        { name: 'Bundesliga', rarity: 'rare', division: '1' },
        { name: 'Jupiler Pro League', rarity: 'rare', division: '1' },
        { name: 'Ligue 1', rarity: 'rare', division: '1' },
        { name: 'Eredivisie', rarity: 'rare', division: '1' },
        { name: 'Challenger', rarity: 'rare', division: '1' },
        { name: 'Contender', rarity: 'rare', division: '1' },
        { name: 'Premier League', rarity: 'rare', division: '2' },
        { name: 'MLS', rarity: 'rare', division: '2' },
        { name: 'LALIGA EA SPORTS', rarity: 'rare', division: '2' },
        { name: 'Bundesliga', rarity: 'rare', division: '2' },
        { name: 'Jupiler Pro League', rarity: 'rare', division: '2' },
        { name: 'Ligue 1', rarity: 'rare', division: '2' },
        { name: 'Eredivisie', rarity: 'rare', division: '2' },
        { name: 'Challenger', rarity: 'rare', division: '2' },
        { name: 'Contender', rarity: 'rare', division: '2' },
        { name: 'Premier League', rarity: 'rare', division: '3' },
        { name: 'MLS', rarity: 'rare', division: '3' },
        { name: 'LALIGA EA SPORTS', rarity: 'rare', division: '3' },
        { name: 'Bundesliga', rarity: 'rare', division: '3' },
        { name: 'Jupiler Pro League', rarity: 'rare', division: '3' },
        { name: 'Ligue 1', rarity: 'rare', division: '3' },
        { name: 'Eredivisie', rarity: 'rare', division: '3' },
        { name: 'Challenger', rarity: 'rare', division: '3' },
        { name: 'Contender', rarity: 'rare', division: '3' },
        { name: 'MLS', rarity: 'rare', division: '1' },
        { name: 'Champion', rarity: 'rare', division: '1' },
        { name: 'All Star', rarity: 'rare', division: '1' },
        { name: 'Under 23', rarity: 'rare', division: '1' },
        { name: 'MLS', rarity: 'rare', division: '2' },
        { name: 'Champion', rarity: 'rare', division: '2' },
        { name: 'All Star', rarity: 'rare', division: '2' },
        { name: 'Under 23', rarity: 'rare', division: '2' },
        { name: 'MLS', rarity: 'rare', division: '3' },
        { name: 'Champion', rarity: 'rare', division: '3' },
        { name: 'All Star', rarity: 'rare', division: '3' },
        { name: 'Under 23', rarity: 'rare', division: '3' },
        { name: 'Premier League', rarity: 'super_rare', division: '1' },
        { name: 'MLS', rarity: 'super_rare', division: '1' },
        { name: 'LALIGA EA SPORTS', rarity: 'super_rare', division: '1' },
        { name: 'Bundesliga', rarity: 'super_rare', division: '1' },
        { name: 'Jupiler Pro League', rarity: 'super_rare', division: '1' },
        { name: 'Ligue 1', rarity: 'super_rare', division: '1' },
        { name: 'Eredivisie', rarity: 'super_rare', division: '1' },
        { name: 'Challenger', rarity: 'super_rare', division: '1' },
        { name: 'Contender', rarity: 'super_rare', division: '1' },
        { name: 'MLS', rarity: 'super_rare', division: '1' },
        { name: 'Champion', rarity: 'super_rare', division: '1' },
        { name: 'All Star', rarity: 'super_rare', division: '1' },
        { name: 'Under 23', rarity: 'super_rare', division: '1' },
        { name: 'MLS', rarity: 'unique', division: '1' },
        { name: 'Unique', rarity: 'unique', division: '1' },
        { name: 'MLS', rarity: 'unique', division: '1' },
        { name: 'Champion', rarity: 'unique', division: '1' },
        { name: 'All Star', rarity: 'unique', division: '1' },
        { name: 'Under 23', rarity: 'unique', division: '1' },
      ]
    },
    {
      slug: 'football-29-29-aug-2025',
      state: 'started',
      startDate: '2025-08-29',
      endDate: '2025-08-29',
      leagues: [
        { name: 'Arena Uncapped', rarity: 'limited', division: 'All' },
        { name: 'Arena', rarity: 'limited', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'rare', division: 'All' },
        { name: 'Arena', rarity: 'rare', division: 'All' },
        { name: 'Arena', rarity: 'super_rare', division: 'All' },
        { name: 'Arena Uncapped', rarity: 'super_rare', division: 'All' },
        { name: 'Arena', rarity: 'unique', division: 'All' },
        { name: 'Under 23', rarity: 'limited', division: '1' },
        { name: 'All Star', rarity: 'limited', division: '1' },
        { name: 'Under 23', rarity: 'limited', division: '2' },
        { name: 'All Star', rarity: 'limited', division: '2' },
        { name: 'Under 23', rarity: 'limited', division: '3' },
        { name: 'All Star', rarity: 'limited', division: '3' },
        { name: 'Under 23', rarity: 'rare', division: '1' },
        { name: 'All Star', rarity: 'rare', division: '1' },
        { name: 'Under 23', rarity: 'rare', division: '2' },
        { name: 'All Star', rarity: 'rare', division: '2' },
        { name: 'Under 23', rarity: 'rare', division: '3' },
        { name: 'All Star', rarity: 'rare', division: '3' },
        { name: 'Under 23', rarity: 'super_rare', division: '1' },
        { name: 'All Star', rarity: 'super_rare', division: '1' },
        { name: 'Under 23', rarity: 'unique', division: '1' },
        { name: 'All Star', rarity: 'unique', division: '1' },
      ]
    }
  ];

  // Utiliser les GameWeeks hardcodées au lieu de celles passées en props
  const availableGameWeeks = HARDCODED_GAMEWEEKS;
  const [selectedGameWeek, setSelectedGameWeek] = useState<string>('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  // Fonction pour obtenir la couleur de rareté
  function getRarityColor(rarity: string): string {
    switch (rarity.toLowerCase()) {
      case 'limited':
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg';
      case 'rare':
        return 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg';
      case 'super_rare':
        return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg';
      case 'unique':
        return 'bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Filtrer les GameWeeks à venir (opened et started)
  const futureGameWeeks = useMemo(() => {
    return availableGameWeeks.filter(gw => 
      gw.state === 'opened' || gw.state === 'started'
    );
  }, [availableGameWeeks]);

  // Obtenir les compétitions de la GameWeek sélectionnée (exclure les common)
  const availableCompetitions = useMemo(() => {
    if (!selectedGameWeek) return [];
    const gameWeek = availableGameWeeks.find(gw => gw.slug === selectedGameWeek);
    return (gameWeek?.leagues || []).filter(league => league.rarity !== 'common');
  }, [selectedGameWeek, availableGameWeeks]);

  const handleGameWeekChange = (value: string) => {
    setSelectedGameWeek(value);
    setSelectedCompetition(''); // Reset la compétition sélectionnée
  };

  const handleGetRecommendations = async () => {
    if (!selectedGameWeek || !selectedCompetition) {
      alert('Veuillez sélectionner une GameWeek et une compétition');
      return;
    }
    
    // Extraire les informations de la compétition sélectionnée
    const [competitionName, rarity, division] = selectedCompetition.split('-');
    
    console.log('🎯 Demande de recommandations pour:', {
      gameWeek: selectedGameWeek,
      competition: {
        name: competitionName,
        rarity: rarity,
        division: division
      }
    });
    
    setIsLoadingRecommendations(true);
    
    try {
      // Construire la question pour l'IA
      const question = `propose moi la meilleur line-up pour la compétition ${competitionName} (${rarity} - D${division}) et justifie tes choix`;
      
      // Ajouter le message utilisateur à l'historique
      const newUserChatMessage: ChatMessage = {
        role: 'user',
        content: question
      };
      
      const updatedHistory = [...conversationHistory, newUserChatMessage];
      setConversationHistory(updatedHistory);

      // Appeler l'API OpenAI avec les cartes utilisateur
      const aiResponse = await callOpenAI(question, updatedHistory, userCards);

      // Ajouter la réponse de l'IA à l'historique
      const newAIChatMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse
      };
      
      setConversationHistory([...updatedHistory, newAIChatMessage]);
      
      // Envoyer les recommandations au chat au lieu de les afficher localement
      if (onRecommendationGenerated) {
        onRecommendationGenerated(aiResponse);
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'appel OpenAI:', error);
      if (onRecommendationGenerated) {
        onRecommendationGenerated('Désolé, une erreur s\'est produite lors de la génération des recommandations. Veuillez réessayer.');
      }
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Lineup Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">GameWeek</label>
          <Select value={selectedGameWeek} onValueChange={handleGameWeekChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une GameWeek" />
            </SelectTrigger>
            <SelectContent>
              {futureGameWeeks.map((gameWeek) => (
                <SelectItem key={gameWeek.slug} value={gameWeek.slug}>
                  {gameWeek.slug.replace('football-', '').replace(/-/g, ' ')}
                  {gameWeek.state === 'opened' && ' (Ouverte)'}
                  {gameWeek.state === 'started' && ' (En cours)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedGameWeek && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Compétition</label>
            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une compétition" />
              </SelectTrigger>
              <SelectContent>
                {availableCompetitions.map((competition, index) => {
                  const uniqueValue = `${competition.name}-${competition.rarity}-${competition.division || '1'}`;
                  return (
                    <SelectItem key={index} value={uniqueValue}>
                      <div className="grid grid-cols-[1fr_auto] items-center gap-4 w-full">
                        <span className="truncate">{competition.name}</span>
                        <div className="flex items-center gap-2 justify-end min-w-[120px]">
                          <Badge className={`text-xs px-2 py-1 ${getRarityColor(competition.rarity)}`}>
                            {competition.rarity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          {competition.division && competition.division !== '1' && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              D{competition.division}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          onClick={handleGetRecommendations}
          disabled={!selectedGameWeek || !selectedCompetition || isLoadingRecommendations}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {isLoadingRecommendations ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Génération des recommandations...
              </div>
            </>
          ) : (
            '🎯 Recevoir les recommandations du coach'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
