import { useState, useMemo, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchUserCards, fetchPlayerPerformance, getPlayerPerformanceFromDB, getDatabaseStats, fetchGameWeeks, calculatePlayerPerformanceFromCard } from '../lib/sorare-api';
import { SorareUser, CardWithPerformance, RarityFilter, PositionFilter, AgeFilter, LeagueFilter, SeasonFilter, SortField, SortDirection, PlayerPerformance, GameWeek } from '../types/sorare';
import { SearchForm } from '../components/search-form';
import { UserSummary } from '../components/user-summary';
import { CardsFilters } from '../components/cards-filters';
import { CardsTable } from '../components/cards-table';
import { ErrorMessage } from '../components/error-message';
import { PerformanceMetrics } from '../components/performance-metrics';
import { GameWeeksSimple } from '../components/gameweeks-simple';
import { Navigation } from '../components/navigation';

const Index = () => {
  const [user, setUser] = useState<SorareUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardsWithPerformance, setCardsWithPerformance] = useState<CardWithPerformance[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<PlayerPerformance | null>(null);
  const [dbStats, setDbStats] = useState<{ cards: number; performances: number }>({ cards: 0, performances: 0 });
  
  // GameWeeks state
  const [gameWeeks, setGameWeeks] = useState<GameWeek[]>([]);
  const [isLoadingGameWeeks, setIsLoadingGameWeeks] = useState(false);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('All');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('All');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('All');
  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>('All');
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('All');
  const [sortField, setSortField] = useState<SortField>('xp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Charger les GameWeeks au démarrage
  useEffect(() => {
    // Test de connexion au backend
    fetch('http://localhost:3001/api/stats')
      .then(response => response.json())
      .then(data => {
        console.log('✅ Connexion backend OK:', data);
        loadGameWeeks();
      })
      .catch(error => {
        console.error('❌ Erreur connexion backend:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter au serveur backend",
          variant: "destructive",
        });
      });
  }, []);

  const loadGameWeeks = async () => {
    console.log('🔄 Début du chargement des GameWeeks');
    setIsLoadingGameWeeks(true);
    try {
      console.log('📡 Test direct de l\'API...');
      
      // Test direct de l'API
      const response = await fetch('http://localhost:3001/api/sorare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query GameWeeks { 
            so5 { 
              so5Fixtures { 
                nodes { 
                  aasmState 
                  slug 
                } 
              } 
            } 
          }`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Données API directes:', data);
      
      const fixtures = data.data?.so5?.so5Fixtures?.nodes || [];
      console.log('📊 Nombre de fixtures:', fixtures.length);
      
      // Convertir en GameWeeks et charger les détails
      const gameWeeksData = [];
      for (const fixture of fixtures.slice(0, 10)) { // Limiter à 10 pour éviter les timeouts
        const dateMatch = fixture.slug.match(/football-(\d+)-(\w+)-(\d+)-(\w+)-(\d+)/);
        let startDate, endDate;
        if (dateMatch) {
          const [_, startDay, startMonth, endDay, endMonth, year] = dateMatch;
          startDate = `${startDay} ${startMonth} ${year}`;
          endDate = `${endDay} ${endMonth} ${year}`;
        }

        // Charger les détails de la GameWeek
        console.log('📅 Chargement détails pour:', fixture.slug);
        const detailsResponse = await fetch('http://localhost:3001/api/sorare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `query GameWeekDetail($slug: String!) {
              so5 {
                so5Fixture(slug: $slug) {
                  aasmState
                  slug
                  so5Leaderboards {
                    so5League {
                      displayName
                    }
                    rarityType
                    division
                  }
                }
              }
            }`,
            variables: { slug: fixture.slug }
          }),
        });

        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          const fixtureDetails = detailsData.data?.so5?.so5Fixture;
          
          if (fixtureDetails) {
            const leagues = fixtureDetails.so5Leaderboards?.map((leaderboard: { so5League: { displayName: string }; rarityType: string; division: string }) => ({
              name: leaderboard.so5League.displayName,
              rarity: leaderboard.rarityType,
              division: leaderboard.division
            })) || [];

            gameWeeksData.push({
              slug: fixture.slug,
              state: fixture.aasmState,
              startDate,
              endDate,
              leagues
            });
            
            console.log('✅ Détails chargés pour:', fixture.slug, '-', leagues.length, 'compétitions');
          }
        } else {
          console.log('⚠️ Erreur chargement détails pour:', fixture.slug);
          gameWeeksData.push({
            slug: fixture.slug,
            state: fixture.aasmState,
            startDate,
            endDate,
            leagues: []
          });
        }
      }

      console.log('📦 GameWeeks converties:', gameWeeksData.length);
      setGameWeeks(gameWeeksData);
      
      if (gameWeeksData.length > 0) {
        console.log('✅ GameWeeks chargées avec succès');
        toast({
          title: "GameWeeks chargées",
          description: `${gameWeeksData.length} GameWeeks trouvées avec compétitions`,
        });
      } else {
        console.log('⚠️ Aucune GameWeek trouvée');
        toast({
          title: "Aucune GameWeek",
          description: "Aucune GameWeek trouvée",
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des GameWeeks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les GameWeeks",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Fin du chargement des GameWeeks');
      setIsLoadingGameWeeks(false);
    }
  };

  const handleSearch = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setCardsWithPerformance([]);
    setSelectedPerformance(null);

    try {
      const data = await fetchUserCards(slug);
      
      if (!data.user) {
        throw new Error('Utilisateur introuvable. Vérifiez le slug Sorare.');
      }

      if (!data.user.cards.nodes || data.user.cards.nodes.length === 0) {
        setUser(data.user);
        toast({
          title: "Aucune carte trouvée",
          description: "Cet utilisateur n'a aucune carte football possédée.",
        });
        return;
      }

      setUser(data.user);

      // Calculer automatiquement les performances à partir des données des cartes
      const cardsWithPerf: CardWithPerformance[] = [];
      for (const card of data.user.cards.nodes) {
        const performance = calculatePlayerPerformanceFromCard(card);
        cardsWithPerf.push({
          ...card,
          performance: performance || undefined
        });
      }

      // Debug: afficher les raretés pour diagnostiquer le problème
      console.log('🔍 Raretés des cartes récupérées:', data.user.cards.nodes.map(card => card.rarity));
      console.log('📊 Cartes avec performances:', cardsWithPerf.map(card => ({ name: card.player.displayName, rarity: card.rarity })));

      setCardsWithPerformance(cardsWithPerf);

      // Mettre à jour les stats de la base de données
      const stats = await getDatabaseStats();
      setDbStats(stats);

      toast({
        title: "Cartes chargées avec succès",
        description: `${data.user.cards.nodes.length} cartes trouvées pour ${data.user.nickname || data.user.slug}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Calculer les ligues et saisons disponibles
  const availableLeagues = useMemo(() => {
    // Temporairement désactivé pour réduire la complexité
    return [];
  }, []);

  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    cardsWithPerformance.forEach(card => {
      if (card.season.startYear) seasons.add(card.season.startYear.toString());
    });
    return Array.from(seasons).sort((a, b) => parseInt(b) - parseInt(a));
  }, [cardsWithPerformance]);

  const filteredAndSortedCards = useMemo(() => {
    if (!cardsWithPerformance.length) return [];

    let filtered = cardsWithPerformance;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.player.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rarity (case insensitive)
    if (rarityFilter !== 'All') {
      filtered = filtered.filter(card => 
        card.rarity.toLowerCase() === rarityFilter.toLowerCase()
      );
    }

    // Filter by position
    if (positionFilter !== 'All') {
      filtered = filtered.filter(card => card.player.position === positionFilter);
    }

    // Filter by age
    if (ageFilter !== 'All') {
      filtered = filtered.filter(card => {
        if (ageFilter === 'U23') {
          return card.player.age <= 23;
        } else {
          return card.player.age > 23;
        }
      });
    }

    // Filter by league (temporairement désactivé)
    // if (leagueFilter !== 'All') {
    //   filtered = filtered.filter(card => {
    //     const league = card.player.activeClub?.domesticLeague?.name || card.player.activeNationalTeam?.officialName;
    //     return league === leagueFilter;
    //   });
    // }

    // Filter by season
    if (seasonFilter !== 'All') {
      filtered = filtered.filter(card => card.season.startYear.toString() === seasonFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'xp':
          aValue = a.xp;
          bValue = b.xp;
          break;
        case 'season':
          aValue = a.season.startYear;
          bValue = b.season.startYear;
          break;
        case 'position':
          aValue = a.player.position;
          bValue = b.player.position;
          break;
        case 'age':
          aValue = a.player.age;
          bValue = b.player.age;
          break;
        case 'league':
          // Temporairement désactivé
          aValue = '';
          bValue = '';
          break;
        case 'rarity':
          aValue = a.rarity;
          bValue = b.rarity;
          break;
        case 'l15':
          aValue = a.performance?.l15 || 0;
          bValue = b.performance?.l15 || 0;
          break;
        case 'dnp':
          aValue = a.performance?.dnpPercentage || 0;
          bValue = b.performance?.dnpPercentage || 0;
          break;
        default:
          aValue = a.xp;
          bValue = b.xp;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [searchTerm, rarityFilter, positionFilter, ageFilter, leagueFilter, seasonFilter, sortField, sortDirection]);

  const cardStats = useMemo(() => {
    if (!cardsWithPerformance.length) return { total: 0, limited: 0, rare: 0 };

    const total = cardsWithPerformance.length;
    const limited = cardsWithPerformance.filter(card => card.rarity.toLowerCase() === 'limited').length;
    const rare = cardsWithPerformance.filter(card => 
      ['rare', 'super rare', 'unique'].includes(card.rarity.toLowerCase())
    ).length;

    return { total, limited, rare };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation currentPage="home" />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Coach IA Sorare
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Analysez vos cartes Sorare et optimisez votre stratégie fantasy football
            </p>
            {dbStats.cards > 0 && (
              <div className="mt-4 text-sm text-white/70">
                💾 {dbStats.cards} cartes sauvegardées • {dbStats.performances} performances calculées
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* GameWeeks Section */}
          <GameWeeksSimple 
            gameWeeks={gameWeeks}
            isLoading={isLoadingGameWeeks}
            onRefresh={loadGameWeeks}
          />

          {/* Cards Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mes Cartes</h2>
            
            {/* Search Form */}
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* User Summary */}
            {user && (
              <UserSummary
                user={user}
                limitedCount={cardStats.limited}
                rareCount={cardStats.rare}
                totalCards={cardStats.total}
              />
            )}

            {/* Performance Metrics */}
            {selectedPerformance && (
              <PerformanceMetrics performance={selectedPerformance} />
            )}

            {/* Cards Section */}
            {cardsWithPerformance.length > 0 && (
              <div className="space-y-4">
                {/* Filters */}
                <CardsFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  rarityFilter={rarityFilter}
                  onRarityChange={setRarityFilter}
                  positionFilter={positionFilter}
                  onPositionChange={setPositionFilter}
                  ageFilter={ageFilter}
                  onAgeChange={setAgeFilter}
                  leagueFilter={leagueFilter}
                  onLeagueChange={setLeagueFilter}
                  seasonFilter={seasonFilter}
                  onSeasonChange={setSeasonFilter}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  availableLeagues={availableLeagues}
                  availableSeasons={availableSeasons}
                />

                {/* Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredAndSortedCards.length} carte(s) affichée(s) sur {cardStats.total} au total
                  </p>
                </div>

                {/* Cards Table */}
                <CardsTable 
                  cards={filteredAndSortedCards} 
                />
              </div>
            )}

            {/* Empty State */}
            {user && cardsWithPerformance.length === 0 && (
              <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border text-center">
                <p className="text-muted-foreground">
                  Aucune carte football possédée trouvée pour cet utilisateur.
                </p>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Index;