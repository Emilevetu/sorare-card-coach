import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  RarityFilter, 
  PositionFilter, 
  AgeFilter, 
  LeagueFilter, 
  SeasonFilter,
  SortField, 
  SortDirection 
} from '../types/sorare';
import { ArrowUpDown, Search, Filter, ChevronDown } from 'lucide-react';

interface CardsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  rarityFilter: RarityFilter;
  onRarityChange: (rarity: RarityFilter) => void;
  positionFilter: PositionFilter;
  onPositionChange: (position: PositionFilter) => void;
  ageFilter: AgeFilter;
  onAgeChange: (age: AgeFilter) => void;
  leagueFilter: LeagueFilter;
  onLeagueChange: (league: LeagueFilter) => void;
  seasonFilter: SeasonFilter;
  onSeasonChange: (season: SeasonFilter) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  availableLeagues: string[];
  availableSeasons: string[];
}

export function CardsFilters({
  searchTerm,
  onSearchChange,
  rarityFilter,
  onRarityChange,
  positionFilter,
  onPositionChange,
  ageFilter,
  onAgeChange,
  leagueFilter,
  onLeagueChange,
  seasonFilter,
  onSeasonChange,
  sortField,
  sortDirection,
  onSortChange,
  availableLeagues,
  availableSeasons,
}: CardsFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Section Recherche - Style Apple */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Rechercher un joueur..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-12 text-lg border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-xl"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => onSortChange('xp')}
            className="h-12 px-6 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl font-medium"
          >
            <ArrowUpDown className="w-5 h-5 mr-2" />
            XP {sortField === 'xp' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>
        </div>
      </div>

      {/* Section Filtres - Style Apple */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rareté</label>
            <Select value={rarityFilter} onValueChange={onRarityChange}>
              <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                <SelectValue placeholder="Toutes raretés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Toutes raretés</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Super Rare">Super Rare</SelectItem>
                <SelectItem value="Unique">Unique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Position</label>
            <Select value={positionFilter} onValueChange={onPositionChange}>
              <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                <SelectValue placeholder="Toutes positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Toutes positions</SelectItem>
                <SelectItem value="Forward">Attaquant</SelectItem>
                <SelectItem value="Midfielder">Milieu</SelectItem>
                <SelectItem value="Defender">Défenseur</SelectItem>
                <SelectItem value="Goalkeeper">Gardien</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Âge</label>
            <Select value={ageFilter} onValueChange={onAgeChange}>
              <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                <SelectValue placeholder="Tous âges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Tous âges</SelectItem>
                <SelectItem value="U23">-23 ans</SelectItem>
                <SelectItem value="Over23">+23 ans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ligue</label>
            <Select value={leagueFilter} onValueChange={onLeagueChange}>
              <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                <SelectValue placeholder="Toutes ligues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Toutes ligues</SelectItem>
                {availableLeagues.map((league) => (
                  <SelectItem key={league} value={league}>
                    {league}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Saison</label>
            <Select value={seasonFilter} onValueChange={onSeasonChange}>
              <SelectTrigger className="h-11 border-gray-200/50 bg-white/50 hover:bg-white rounded-xl">
                <SelectValue placeholder="Toutes saisons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Toutes saisons</SelectItem>
                {availableSeasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section Tri - Style Apple */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trier par</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange('position')}
            className={`h-10 justify-start text-sm rounded-xl border-gray-200/50 ${
              sortField === 'position' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white/50 hover:bg-white'
            }`}
          >
            Position {sortField === 'position' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange('age')}
            className={`h-10 justify-start text-sm rounded-xl border-gray-200/50 ${
              sortField === 'age' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white/50 hover:bg-white'
            }`}
          >
            Âge {sortField === 'age' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange('rarity')}
            className={`h-10 justify-start text-sm rounded-xl border-gray-200/50 ${
              sortField === 'rarity' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white/50 hover:bg-white'
            }`}
          >
            Rareté {sortField === 'rarity' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange('l15')}
            className={`h-10 justify-start text-sm rounded-xl border-gray-200/50 ${
              sortField === 'l15' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white/50 hover:bg-white'
            }`}
          >
            L15 {sortField === 'l15' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange('dnp')}
            className={`h-10 justify-start text-sm rounded-xl border-gray-200/50 ${
              sortField === 'dnp' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white/50 hover:bg-white'
            }`}
          >
            Matchs Joués {sortField === 'dnp' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange('league')}
            className={`h-10 justify-start text-sm rounded-xl border-gray-200/50 ${
              sortField === 'league' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white/50 hover:bg-white'
            }`}
          >
            Ligue {sortField === 'league' && (sortDirection === 'desc' ? '↓' : '↑')}
          </Button>
        </div>
      </div>
    </div>
  );
}