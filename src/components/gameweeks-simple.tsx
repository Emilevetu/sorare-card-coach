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

  // Afficher toutes les GameWeeks
  const getFutureGameWeeks = () => {
    console.log('🎮 GameWeeks reçues dans le composant:', gameWeeks.length, gameWeeks);
    return gameWeeks.slice(0, 10); // Afficher les 10 premières
  };

  const futureGameWeeks = getFutureGameWeeks();

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

  if (!gameWeeks || gameWeeks.length === 0) {
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
