import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchUserCards, getDatabaseStats, fetchGameWeeks, calculatePlayerPerformanceFromCard } from '../lib/sorare-api';
import { SorareUser, CardWithPerformance, RarityFilter, PositionFilter, AgeFilter, LeagueFilter, SeasonFilter, SortField, SortDirection, PlayerPerformance, GameWeek } from '../types/sorare';
import { SearchForm } from '../components/search-form';
import { UserSummary } from '../components/user-summary';
import { CardsTable } from '../components/cards-table';
import { ErrorMessage } from '../components/error-message';
import { PerformanceMetrics } from '../components/performance-metrics';
import { GameWeeksSimple } from '../components/gameweeks-simple';
import { Navigation } from '../components/navigation';
import { AICoach } from '../components/ai-coach';
import { AICoachTest } from '../components/ai-coach-test';

// Clés pour le localStorage
const STORAGE_KEYS = {
  USER_SLUG: 'sorare_user_slug',
  USER_DATA: 'sorare_user_data',
  CARDS_DATA: 'sorare_cards_data',
  DB_STATS: 'sorare_db_stats',
  FILTERS: 'sorare_filters'
};

// Interface pour les filtres sauvegardés
interface SavedFilters {
  searchTerm: string;
  rarityFilter: RarityFilter;
  positionFilter: PositionFilter;
  ageFilter: AgeFilter;
  leagueFilter: LeagueFilter;
  seasonFilter: SeasonFilter;
  sortField: SortField;
  sortDirection: SortDirection;
}

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

  // Fonction pour sauvegarder l'état dans localStorage
  const saveState = (userData: SorareUser | null, cardsData: CardWithPerformance[], stats: { cards: number; performances: number }) => {
    try {
      if (userData) {
        localStorage.setItem(STORAGE_KEYS.USER_SLUG, userData.slug);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.CARDS_DATA, JSON.stringify(cardsData));
        localStorage.setItem(STORAGE_KEYS.DB_STATS, JSON.stringify(stats));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_SLUG);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.CARDS_DATA);
        localStorage.removeItem(STORAGE_KEYS.DB_STATS);
      }
    } catch (error) {
      console.warn('Impossible de sauvegarder l\'état dans localStorage:', error);
    }
  };

  // Fonction pour sauvegarder les filtres
  const saveFilters = () => {
    try {
      const filters: SavedFilters = {
        searchTerm,
        rarityFilter,
        positionFilter,
        ageFilter,
        leagueFilter,
        seasonFilter,
        sortField,
        sortDirection
      };
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    } catch (error) {
      console.warn('Impossible de sauvegarder les filtres dans localStorage:', error);
    }
  };

  // Fonction pour restaurer l'état depuis localStorage
  const restoreState = async () => {
    try {
      const savedSlug = localStorage.getItem(STORAGE_KEYS.USER_SLUG);
      const savedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const savedCardsData = localStorage.getItem(STORAGE_KEYS.CARDS_DATA);
      const savedStats = localStorage.getItem(STORAGE_KEYS.DB_STATS);
      const savedFilters = localStorage.getItem(STORAGE_KEYS.FILTERS);

      if (savedSlug && savedUserData && savedCardsData && savedStats) {
        const userData = JSON.parse(savedUserData);
        const cardsData = JSON.parse(savedCardsData);
        const stats = JSON.parse(savedStats);

        setUser(userData);
        setCardsWithPerformance(cardsData);
        setDbStats(stats);

        // Restaurer les filtres
        if (savedFilters) {
          const filters: SavedFilters = JSON.parse(savedFilters);
          setSearchTerm(filters.searchTerm);
          setRarityFilter(filters.rarityFilter);
          setPositionFilter(filters.positionFilter);
          setAgeFilter(filters.ageFilter);
          setLeagueFilter(filters.leagueFilter);
          setSeasonFilter(filters.seasonFilter);
          setSortField(filters.sortField);
          setSortDirection(filters.sortDirection);
        }

        console.log('✅ État restauré depuis localStorage');
        return true;
      }
    } catch (error) {
      console.warn('Erreur lors de la restauration de l\'état:', error);
      // En cas d'erreur, nettoyer le localStorage
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    }
    return false;
  };

  // Charger les GameWeeks et restaurer l'état au démarrage
  useEffect(() => {
    const initializeApp = async () => {
      await loadGameWeeks();
      await restoreState();
    };
    initializeApp();
  }, []);

  // Sauvegarder les filtres quand ils changent (avec debounce)
  useEffect(() => {
    if (user) { // Ne sauvegarder que si un utilisateur est connecté
      const timeoutId = setTimeout(() => {
        saveFilters();
      }, 500); // Debounce de 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, rarityFilter, positionFilter, ageFilter, leagueFilter, seasonFilter, sortField, sortDirection, user]);

  const loadGameWeeks = async () => {
    setIsLoadingGameWeeks(true);
    try {
      console.log('🔄 Début du chargement des GameWeeks...');
      const gameWeeksData = await fetchGameWeeks();
      console.log('✅ GameWeeks chargées:', gameWeeksData.length, gameWeeksData);
      setGameWeeks(gameWeeksData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des GameWeeks:', error);
    } finally {
      setIsLoadingGameWeeks(false);
      console.log('🏁 Fin du chargement des GameWeeks');
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
        saveState(data.user, [], { cards: 0, performances: 0 });
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

      setCardsWithPerformance(cardsWithPerf);

      // Mettre à jour les stats de la base de données
      const stats = await getDatabaseStats();
      setDbStats(stats);

      // Sauvegarder l'état
      saveState(data.user, cardsWithPerf, stats);

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

  const handleLogout = () => {
    setUser(null);
    setCardsWithPerformance([]);
    setSelectedPerformance(null);
    setError(null);
    setSearchTerm('');
    setRarityFilter('All');
    setPositionFilter('All');
    setAgeFilter('All');
    setLeagueFilter('All');
    setSeasonFilter('All');
    setSortField('xp');
    setSortDirection('desc');
    
    // Nettoyer le localStorage
    saveState(null, [], { cards: 0, performances: 0 });
    
    toast({
      title: "Déconnexion réussie",
      description: "Vos données ont été effacées.",
    });
  };

  // Calculer les ligues et saisons disponibles
  const availableLeagues = useMemo(() => {
    const leagues = new Set<string>();
    cardsWithPerformance.forEach(card => {
      if (card.player.activeClub?.domesticLeague?.name) {
        leagues.add(card.player.activeClub.domesticLeague.name);
      }
    });
    return Array.from(leagues).sort();
  }, [cardsWithPerformance]);

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
        if (ageFilter === '-23 ans') {
          return card.player.age <= 23;
        } else if (ageFilter === 'Over23') {
          return card.player.age > 23;
        }
        return true;
      });
    }

    // Filter by league
    if (leagueFilter !== 'All') {
      filtered = filtered.filter(card => {
        const league = card.player.activeClub?.domesticLeague?.name;
        return league === leagueFilter;
      });
    }

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
          aValue = a.player.activeClub?.domesticLeague?.name || '';
          bValue = b.player.activeClub?.domesticLeague?.name || '';
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
          aValue = a.performance?.gamesPlayed || 0;
          bValue = b.performance?.gamesPlayed || 0;
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
  }, [cardsWithPerformance, searchTerm, rarityFilter, positionFilter, ageFilter, leagueFilter, seasonFilter, sortField, sortDirection]);

  const cardStats = useMemo(() => {
    if (!cardsWithPerformance.length) return { total: 0, limited: 0, rare: 0 };

    const total = cardsWithPerformance.length;
    const limited = cardsWithPerformance.filter(card => card.rarity.toLowerCase() === 'limited').length;
    const rare = cardsWithPerformance.filter(card => 
      ['rare', 'super rare', 'unique'].includes(card.rarity.toLowerCase())
    ).length;

    return { total, limited, rare };
  }, [cardsWithPerformance]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation currentPage="home" />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-apple opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-black">
              Ton Coach IA - Sorare
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Analysez vos cartes Sorare et optimisez votre stratégie fantasy football
            </p>
            {dbStats.cards > 0 && (
              <div className="mt-8 text-sm text-white/70 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/20">
                💾 {dbStats.cards} cartes sauvegardées • {dbStats.performances} performances calculées
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* User Summary Section - Tout en haut */}
          {user && (
            <div className="space-y-6">
              <UserSummary
                user={user}
                limitedCount={cardStats.limited}
                rareCount={cardStats.rare}
                totalCards={cardStats.total}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Search Form Section - Mise en avant pour la connexion */}
                                {!user && (
                        <div className="space-y-6">
                          <SearchForm 
                            onSearch={handleSearch} 
                            onLogout={handleLogout}
                            isLoading={isLoading} 
                            currentUser={user?.slug || null}
                          />
                        </div>
                      )}

          {/* GameWeeks Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">GameWeeks</h2>
            <GameWeeksSimple 
              gameWeeks={gameWeeks}
              isLoading={isLoadingGameWeeks}
              onRefresh={loadGameWeeks}
            />
          </div>

                     {/* Mon Coach Section - Visible seulement si utilisateur connecté */}
           {user && (
             <div className="space-y-6">
               <h2 className="text-3xl font-bold text-foreground">Mon Coach</h2>
               <AICoach gameWeeks={gameWeeks} />
             </div>
           )}

           {/* Mon Coach Test Section - Visible seulement si utilisateur connecté */}
           {user && (
             <div className="space-y-6">
               <h2 className="text-3xl font-bold text-foreground">Mon Coach Test</h2>
               <AICoachTest userCards={cardsWithPerformance} />
             </div>
           )}

           {/* Cards Section - Visible seulement si utilisateur connecté */}
           {user && (
             <div className="space-y-6">
               <h2 className="text-3xl font-bold text-foreground">Mes Cartes</h2>
            
            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Performance Metrics */}
            {selectedPerformance && (
              <PerformanceMetrics performance={selectedPerformance} />
            )}

            {/* Cards Section */}
            {cardsWithPerformance.length > 0 && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Rechercher un joueur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border-0 bg-muted/50 focus:bg-card focus:ring-2 focus:ring-apple-blue/20 rounded-lg outline-none transition-all"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {filteredAndSortedCards.length} carte(s) affichée(s) sur {cardStats.total} au total
                    </div>
                  </div>
                </div>

                {/* Cards Table */}
                <CardsTable 
                  cards={filteredAndSortedCards}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  positionFilter={positionFilter}
                  onPositionChange={setPositionFilter}
                  ageFilter={ageFilter}
                  onAgeChange={setAgeFilter}
                  leagueFilter={leagueFilter}
                  onLeagueChange={setLeagueFilter}
                  seasonFilter={seasonFilter}
                  onSeasonChange={setSeasonFilter}
                  rarityFilter={rarityFilter}
                  onRarityChange={setRarityFilter}
                  availableLeagues={availableLeagues}
                  availableSeasons={availableSeasons}
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
          )}
        </div>
      </div>

      {/* Espace en bas pour que la dernière section soit visible au milieu */}
      <div className="h-32"></div>
    </div>
  );
};

export default Index;