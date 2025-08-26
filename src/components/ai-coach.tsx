import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameWeek } from '@/types/sorare';

interface AICoachProps {
  gameWeeks: GameWeek[];
}

export function AICoach({ gameWeeks }: AICoachProps) {
  const [selectedGameWeek, setSelectedGameWeek] = useState<string>('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');

  // Fonction pour obtenir la couleur de rareté
  function getRarityColor(rarity: string): string {
    switch (rarity.toLowerCase()) {
      case 'limited':
        return 'bg-sorare-blue/20 text-sorare-blue';
      case 'rare':
        return 'bg-sorare-purple/20 text-sorare-purple';
      case 'super_rare':
        return 'bg-gradient-primary text-white';
      case 'unique':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Filtrer les GameWeeks à venir (opened et started)
  const futureGameWeeks = useMemo(() => {
    return gameWeeks.filter(gw => 
      gw.state === 'opened' || gw.state === 'started'
    );
  }, [gameWeeks]);

  // Obtenir les compétitions de la GameWeek sélectionnée (exclure les common)
  const availableCompetitions = useMemo(() => {
    if (!selectedGameWeek) return [];
    const gameWeek = gameWeeks.find(gw => gw.slug === selectedGameWeek);
    return (gameWeek?.leagues || []).filter(league => league.rarity !== 'common');
  }, [selectedGameWeek, gameWeeks]);

  const handleGameWeekChange = (value: string) => {
    setSelectedGameWeek(value);
    setSelectedCompetition(''); // Reset la compétition sélectionnée
  };

  const handleGetRecommendations = () => {
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
    
    // TODO: Implémenter la logique de recommandations IA
    alert(`Fonctionnalité de recommandations IA à venir !\n\nGameWeek: ${selectedGameWeek}\nCompétition: ${competitionName} (${rarity} - D${division})`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Mon Coach
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
                            {competition.rarity.replace('_', ' ')}
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
          disabled={!selectedGameWeek || !selectedCompetition}
          className="w-full"
        >
          🎯 Recevoir les recommandations du coach
        </Button>
      </CardContent>
    </Card>
  );
}
