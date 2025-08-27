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
          disabled={!selectedGameWeek || !selectedCompetition}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          🎯 Recevoir les recommandations du coach
        </Button>
      </CardContent>
    </Card>
  );
}
