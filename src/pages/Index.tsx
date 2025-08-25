import { useState, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchUserCards } from '../lib/sorare-api';
import { SorareUser, SorareCard, RarityFilter, SortField, SortDirection } from '../types/sorare';
import { SearchForm } from '../components/search-form';
import { UserSummary } from '../components/user-summary';
import { CardsFilters } from '../components/cards-filters';
import { CardsTable } from '../components/cards-table';
import { ErrorMessage } from '../components/error-message';

const Index = () => {
  const [user, setUser] = useState<SorareUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('All');
  const [sortField, setSortField] = useState<SortField>('xp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSearch = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);

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

  const filteredAndSortedCards = useMemo(() => {
    if (!user?.cards.nodes) return [];

    let filtered = user.cards.nodes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.player.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rarity
    if (rarityFilter !== 'All') {
      filtered = filtered.filter(card => card.rarity === rarityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortField === 'xp') {
        aValue = a.xp;
        bValue = b.xp;
      } else {
        aValue = a.season.startYear;
        bValue = b.season.startYear;
      }

      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [user, searchTerm, rarityFilter, sortField, sortDirection]);

  const cardStats = useMemo(() => {
    if (!user?.cards.nodes) return { total: 0, limited: 0, rare: 0 };

    const total = user.cards.nodes.length;
    const limited = user.cards.nodes.filter(card => card.rarity === 'Limited').length;
    const rare = user.cards.nodes.filter(card => 
      ['Rare', 'Super Rare', 'Unique'].includes(card.rarity)
    ).length;

    return { total, limited, rare };
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
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

          {/* Cards Section */}
          {user?.cards.nodes && user.cards.nodes.length > 0 && (
            <div className="space-y-4">
              {/* Filters */}
              <CardsFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                rarityFilter={rarityFilter}
                onRarityChange={setRarityFilter}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
              />

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedCards.length} carte(s) affichée(s) sur {cardStats.total} au total
                </p>
              </div>

              {/* Cards Table */}
              <CardsTable cards={filteredAndSortedCards} />
            </div>
          )}

          {/* Empty State */}
          {user && (!user.cards.nodes || user.cards.nodes.length === 0) && (
            <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border text-center">
              <p className="text-muted-foreground">
                Aucune carte football possédée trouvée pour cet utilisateur.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;