import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Loader2, MessageSquare } from 'lucide-react';

import { CardWithPerformance } from '../types/sorare';

interface AICoachProps {
  gameWeeks: Array<{ slug: string; startDate?: string; endDate?: string }>;
  cards: CardWithPerformance[];
}

interface Recommendation {
  type: 'lineup' | 'strategy' | 'warning';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function AICoach({ gameWeeks, cards }: AICoachProps) {
  const [selectedGameWeek, setSelectedGameWeek] = useState<string>('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Compétitions disponibles
  const competitions = [
    { value: 'ligue1', label: 'Ligue 1', description: 'Championnat français' },
    { value: 'premier-league', label: 'Premier League', description: 'Championnat anglais' },
    { value: 'bundesliga', label: 'Bundesliga', description: 'Championnat allemand' },
    { value: 'laliga', label: 'La Liga', description: 'Championnat espagnol' },
    { value: 'serie-a', label: 'Serie A', description: 'Championnat italien' },
    { value: 'u23', label: 'U23', description: 'Compétition jeunes' },
    { value: 'all-star', label: 'All-Star', description: 'Compétition internationale' },
    { value: 'classic', label: 'Classic', description: 'Compétition classique' },
  ];

  // Filtrer les GameWeeks futures jusqu'à mi-septembre
  const getFutureGameWeeks = () => {
    const now = new Date();
    const midSeptember = new Date(now.getFullYear(), 8, 15); // 15 septembre (mois 8 = septembre)
    
    return gameWeeks.filter(gameWeek => {
      if (!gameWeek.startDate) return false;
      
      const gameWeekStart = new Date(gameWeek.startDate);
      return gameWeekStart >= now && gameWeekStart <= midSeptember;
    }).sort((a, b) => {
      if (!a.startDate || !b.startDate) return 0;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  };

  const futureGameWeeks = getFutureGameWeeks();

  const handleGetRecommendations = async () => {
    if (!selectedGameWeek || !selectedCompetition) {
      return;
    }

    setIsLoading(true);
    setRecommendations([]);

    try {
      // Simulation d'une requête IA (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Recommandations simulées basées sur les cartes disponibles
      const mockRecommendations: Recommendation[] = [
        {
          type: 'lineup',
          title: 'Composition recommandée',
          description: `Basé sur vos ${cards.length} cartes, je recommande une formation 4-3-3 avec focus sur les attaquants en forme.`,
          priority: 'high'
        },
        {
          type: 'strategy',
          title: 'Stratégie de bonus',
          description: 'Vos cartes Limited peuvent bénéficier du Cap Bonus. Gardez le total L15 sous 260.',
          priority: 'medium'
        },
        {
          type: 'warning',
          title: 'Attention aux blessures',
          description: '2 de vos joueurs ont un DNP% élevé. Surveillez les dernières nouvelles.',
          priority: 'high'
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lineup':
        return <Sparkles className="w-4 h-4" />;
      case 'strategy':
        return <Brain className="w-4 h-4" />;
      case 'warning':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mon Coach IA</h2>
          <p className="text-gray-600">Recevez des recommandations personnalisées pour optimiser vos compositions</p>
        </div>
      </div>

      {/* Interface de sélection */}
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Paramètres de recommandation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">GameWeek</label>
              <Select value={selectedGameWeek} onValueChange={setSelectedGameWeek}>
                <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                  <SelectValue placeholder="Sélectionner une GameWeek" />
                </SelectTrigger>
                <SelectContent>
                  {futureGameWeeks.length > 0 ? (
                    futureGameWeeks.map((gameWeek) => (
                      <SelectItem key={gameWeek.slug} value={gameWeek.slug}>
                        {gameWeek.startDate && gameWeek.endDate 
                          ? `${gameWeek.startDate} - ${gameWeek.endDate}`
                          : gameWeek.slug.replace('football-', '').replace(/-/g, ' ')
                        }
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Aucune GameWeek future disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Compétition</label>
              <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                  <SelectValue placeholder="Sélectionner une compétition" />
                </SelectTrigger>
                <SelectContent>
                  {competitions.map((competition) => (
                    <SelectItem key={competition.value} value={competition.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{competition.label}</span>
                        <span className="text-xs text-gray-500">{competition.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGetRecommendations}
            disabled={!selectedGameWeek || !selectedCompetition || isLoading || futureGameWeeks.length === 0}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Recevoir les recommandations du coach
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Section des recommandations */}
      {recommendations.length > 0 && (
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Recommandations du Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${getPriorityColor(recommendation.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(recommendation.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{recommendation.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(recommendation.priority)}`}
                      >
                        {recommendation.priority === 'high' ? 'Important' : 
                         recommendation.priority === 'medium' ? 'Conseil' : 'Info'}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{recommendation.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Message d'aide */}
      {!selectedGameWeek || !selectedCompetition ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {futureGameWeeks.length > 0 ? 'Prêt à recevoir des conseils ?' : 'Aucune GameWeek future disponible'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {futureGameWeeks.length > 0 
              ? 'Sélectionnez une GameWeek future et une compétition pour recevoir des recommandations personnalisées basées sur votre collection de cartes.'
              : 'Il n\'y a actuellement aucune GameWeek future disponible jusqu\'à mi-septembre. Revenez plus tard pour de nouvelles recommandations.'
            }
          </p>
        </div>
      ) : null}
    </div>
  );
}
