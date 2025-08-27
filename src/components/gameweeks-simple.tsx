import { useState } from 'react';
import { GameWeek } from '../types/sorare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trophy, Users, Clock } from 'lucide-react';

interface GameWeeksSimpleProps {
  gameWeeks: GameWeek[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function GameWeeksSimple({ gameWeeks, isLoading, onRefresh }: GameWeeksSimpleProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedGameWeeks, setExpandedGameWeeks] = useState<Set<string>>(new Set());

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

  // Utiliser les GameWeeks hardcodées avec les vraies données de l'API Sorare
  const futureGameWeeks = HARDCODED_GAMEWEEKS;
  console.log('🎮 GameWeeks hardcodées:', futureGameWeeks.length, futureGameWeeks);

  function getStateColor(state: string): string {
    switch (state.toLowerCase()) {
      case 'opened':
        return 'bg-blue-100 text-blue-800';
      case 'started':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStateIcon(state: string) {
    switch (state.toLowerCase()) {
      case 'opened':
        return <Clock className="w-4 h-4" />;
      case 'started':
        return <Trophy className="w-4 h-4" />;
      case 'closed':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  }

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button variant="outline" disabled>
            Chargement...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (futureGameWeeks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={onRefresh}>
            Actualiser
          </Button>
        </div>
        <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border text-center">
          <p className="text-muted-foreground">
            Aucune GameWeek trouvée ou erreur de chargement.
          </p>
        </div>
      </div>
    );
  }

  if (futureGameWeeks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={onRefresh}>
            Actualiser
          </Button>
        </div>
        <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border text-center">
          <div className="space-y-4">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">Aucune GameWeek future disponible</h3>
            <p className="text-muted-foreground">
              Il n'y a actuellement aucune GameWeek future disponible.
            </p>
            <p className="text-sm text-muted-foreground">
              Revenez plus tard pour voir les nouvelles GameWeeks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const toggleGameWeekExpansion = (gameWeekSlug: string) => {
    setExpandedGameWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(gameWeekSlug)) {
        newSet.delete(gameWeekSlug);
      } else {
        newSet.add(gameWeekSlug);
      }
      return newSet;
    });
  };

  const filterNonCommonLeagues = (leagues: Array<{ rarity: string }>) => {
    return leagues.filter(league => league.rarity !== 'common');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button variant="outline" onClick={onRefresh}>
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(showAll ? futureGameWeeks : futureGameWeeks.slice(0, 3)).map((gameWeek) => (
          <Card key={gameWeek.slug} className="bg-gradient-card border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {gameWeek.startDate && gameWeek.endDate ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{gameWeek.startDate} - {gameWeek.endDate}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{gameWeek.slug.replace('football-', '').replace(/-/g, ' ')}</span>
                    </div>
                  )}
                </CardTitle>
                <Badge className={getStateColor(gameWeek.state)}>
                  <div className="flex items-center gap-1">
                    {getStateIcon(gameWeek.state)}
                    <span className="capitalize">{gameWeek.state}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>{filterNonCommonLeagues(gameWeek.leagues).length} compétition(s)</span>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterNonCommonLeagues(gameWeek.leagues).length > 0 ? (
                    <>
                      {(expandedGameWeeks.has(gameWeek.slug) 
                        ? filterNonCommonLeagues(gameWeek.leagues) 
                        : filterNonCommonLeagues(gameWeek.leagues).slice(0, 5)
                      ).map((league: { name: string; rarity: string; division?: string }, index) => (
                        <div key={index} className="flex items-center justify-between p-1 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{league.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge className={`text-xs ${getRarityColor(league.rarity)}`}>
                              {league.rarity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            {league.division && league.division !== '1' && (
                              <Badge variant="outline" className="text-xs">
                                D{league.division}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {!expandedGameWeeks.has(gameWeek.slug) && filterNonCommonLeagues(gameWeek.leagues).length > 5 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{filterNonCommonLeagues(gameWeek.leagues).length - 5} autres compétitions
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground text-center p-2">
                      Aucune compétition disponible
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {filterNonCommonLeagues(gameWeek.leagues).length} compétition(s)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {filterNonCommonLeagues(gameWeek.leagues).filter(l => l.rarity === 'limited').length} Limited
                    </span>
                  </div>
                  
                  {filterNonCommonLeagues(gameWeek.leagues).length > 5 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mb-2"
                      onClick={() => toggleGameWeekExpansion(gameWeek.slug)}
                    >
                      {expandedGameWeeks.has(gameWeek.slug) ? 'Afficher moins' : 'Afficher toutes les compétitions'}
                    </Button>
                  )}
                  

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!showAll && futureGameWeeks.length > 3 && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="px-8"
          >
            Afficher plus de GameWeeks
          </Button>
        </div>
      )}
      
      {showAll && futureGameWeeks.length > 3 && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(false)}
            className="px-8"
          >
            Afficher moins
          </Button>
        </div>
      )}
    </div>
  );
}
