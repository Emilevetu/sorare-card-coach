import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RarityFilter, SortField, SortDirection } from '../types/sorare';
import { ArrowUpDown, Search } from 'lucide-react';

interface CardsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  rarityFilter: RarityFilter;
  onRarityChange: (rarity: RarityFilter) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
}

export function CardsFilters({
  searchTerm,
  onSearchChange,
  rarityFilter,
  onRarityChange,
  sortField,
  sortDirection,
  onSortChange,
}: CardsFiltersProps) {
  return (
    <div className="bg-gradient-card rounded-xl p-4 shadow-card border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un joueur..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={rarityFilter} onValueChange={onRarityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Rareté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Toutes raretés</SelectItem>
            <SelectItem value="Limited">Limited</SelectItem>
            <SelectItem value="Rare">Rare</SelectItem>
            <SelectItem value="Super Rare">Super Rare</SelectItem>
            <SelectItem value="Unique">Unique</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          onClick={() => onSortChange('xp')}
          className="justify-start"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          XP {sortField === 'xp' && (sortDirection === 'desc' ? '↓' : '↑')}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onSortChange('season')}
          className="justify-start"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Saison {sortField === 'season' && (sortDirection === 'desc' ? '↓' : '↑')}
        </Button>
      </div>
    </div>
  );
}