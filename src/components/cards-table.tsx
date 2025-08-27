import { CardWithPerformance, SortField, SortDirection, PositionFilter, AgeFilter, LeagueFilter, SeasonFilter, RarityFilter } from '../types/sorare';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';

interface CardsTableProps {
  cards: CardWithPerformance[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  positionFilter: PositionFilter;
  onPositionChange: (position: PositionFilter) => void;
  ageFilter: AgeFilter;
  onAgeChange: (age: AgeFilter) => void;
  leagueFilter: LeagueFilter;
  onLeagueChange: (league: LeagueFilter) => void;
  seasonFilter: SeasonFilter;
  onSeasonChange: (season: SeasonFilter) => void;
  rarityFilter: RarityFilter;
  onRarityChange: (rarity: RarityFilter) => void;
  availableLeagues: string[];
  availableSeasons: string[];
}

function getRarityBadgeVariant(rarity: string) {
  switch (rarity) {
    case 'Limited':
      return 'bg-sorare-blue/20 text-sorare-blue hover:bg-sorare-blue/30';
    case 'Rare':
      return 'bg-sorare-purple/20 text-sorare-purple hover:bg-sorare-purple/30';
    case 'Super Rare':
      return 'bg-gradient-primary text-white';
    case 'Unique':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    default:
      return 'secondary';
  }
}

function formatXP(xp: number): string {
  return xp.toLocaleString('fr-FR');
}

function getPerformanceColor(score: number): string {
  if (score >= 60) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}



// Composant pour les en-têtes avec tri et filtres
function SortableHeader({ 
  title, 
  field, 
  currentSort, 
  currentDirection, 
  onSort, 
  children,
  className = ""
}: { 
  title: string; 
  field: SortField; 
  currentSort: SortField; 
  currentDirection: SortDirection; 
  onSort: (field: SortField) => void; 
  children?: React.ReactNode; 
  className?: string;
}) {
  return (
    <TableHead className={`font-semibold text-gray-900 py-4 cursor-pointer hover:bg-gray-100/50 transition-colors ${className}`}>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto p-0 font-semibold text-gray-900 hover:bg-transparent"
      >
        <div className="flex items-center gap-1">
          {title}
          {currentSort === field ? (
            currentDirection === 'asc' ? '↑' : '↓'
          ) : (
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </Button>
      {children}
    </TableHead>
  );
}

// Composant pour les en-têtes avec filtres
function FilterableHeader({ 
  title, 
  field, 
  currentSort, 
  currentDirection, 
  onSort, 
  filterValue, 
  onFilterChange, 
  options, 
  placeholder,
  className = ""
}: { 
  title: string; 
  field: SortField; 
  currentSort: SortField; 
  currentDirection: SortDirection; 
  onSort: (field: SortField) => void; 
  filterValue: string; 
  onFilterChange: (value: string) => void; 
  options: string[]; 
  placeholder: string; 
  className?: string;
}) {
  return (
    <TableHead className={`font-semibold text-gray-900 py-4 ${className}`}>
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={() => onSort(field)}
          className="h-auto p-0 font-semibold text-gray-900 hover:bg-transparent"
        >
          <div className="flex items-center gap-1">
            {title}
            {currentSort === field ? (
              currentDirection === 'asc' ? '↑' : '↓'
            ) : (
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </Button>
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tous</SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </TableHead>
  );
}

export function CardsTable({ 
  cards, 
  sortField, 
  sortDirection, 
  onSortChange,
  positionFilter,
  onPositionChange,
  ageFilter,
  onAgeChange,
  leagueFilter,
  onLeagueChange,
  seasonFilter,
  onSeasonChange,
  rarityFilter,
  onRarityChange,
  availableLeagues,
  availableSeasons
}: CardsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  
  // Calculer les cartes à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  if (cards.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune carte trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200/50 bg-gray-50/30">
              <TableHead className="font-semibold text-gray-900 py-4">Joueur</TableHead>
              <FilterableHeader 
                title="Position" 
                field="position" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                filterValue={positionFilter}
                onFilterChange={onPositionChange}
                options={['Defender', 'Midfielder', 'Forward', 'Goalkeeper']}
                placeholder="Position"
              />
              <FilterableHeader 
                title="Âge" 
                field="age" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                filterValue={ageFilter}
                onFilterChange={onAgeChange}
                options={['-23 ans']}
                placeholder="Âge"
                className="text-center"
              />
              <TableHead className="font-semibold text-gray-900 py-4">Club</TableHead>
              <FilterableHeader 
                title="Ligue" 
                field="league" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                filterValue={leagueFilter}
                onFilterChange={onLeagueChange}
                options={availableLeagues}
                placeholder="Ligue"
              />
              <FilterableHeader 
                title="Rareté" 
                field="rarity" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                filterValue={rarityFilter}
                onFilterChange={onRarityChange}
                options={['Limited', 'Rare', 'Super Rare', 'Unique']}
                placeholder="Rareté"
              />
              <FilterableHeader 
                title="Saison" 
                field="season" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                filterValue={seasonFilter}
                onFilterChange={onSeasonChange}
                options={availableSeasons}
                placeholder="Saison"
                className="text-center"
              />
              <SortableHeader 
                title="XP" 
                field="xp" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                className="text-center"
              />
              <SortableHeader 
                title="L15" 
                field="l15" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                className="text-center"
              />
              <SortableHeader 
                title="Matchs Joués" 
                field="dnp" 
                currentSort={sortField} 
                currentDirection={sortDirection} 
                onSort={onSortChange}
                className="text-center"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCards.map((card) => (
              <TableRow key={card.id} className="border-gray-200/30 hover:bg-gray-50/50 transition-all duration-200">
                <TableCell className="font-medium">{card.player.displayName}</TableCell>
                <TableCell>{card.player.position}</TableCell>
                <TableCell className="text-center">{card.player.age}</TableCell>
                <TableCell>
                  {card.player.activeClub?.name || '—'}
                </TableCell>
                <TableCell>
                  {card.player.activeClub?.domesticLeague?.name || '—'}
                </TableCell>
                <TableCell>
                  <Badge className={getRarityBadgeVariant(card.rarity)}>
                    {card.rarity}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{card.season.startYear}</TableCell>
                <TableCell className="text-center font-mono font-medium">
                  {formatXP(card.xp)}
                </TableCell>
                <TableCell className="text-center">
                  {card.performance ? (
                    <span className={`font-semibold ${getPerformanceColor(card.performance.l15)}`}>
                      {card.performance.l15}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {card.performance ? (
                    <span className={`font-semibold ${card.performance.gamesPlayed >= card.performance.totalGames * 0.8 ? 'text-green-600' : card.performance.gamesPlayed >= card.performance.totalGames * 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {card.performance.gamesPlayed}/{card.performance.totalGames}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 border-t border-gray-200/50 bg-gray-50/30">
          <div className="text-sm text-gray-600 font-medium">
            Affichage {startIndex + 1}-{Math.min(endIndex, cards.length)} sur {cards.length} cartes
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-gray-200/50 bg-white/50 hover:bg-white rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === pageNum 
                        ? 'bg-blue-500 text-white' 
                        : 'border-gray-200/50 bg-white/50 hover:bg-white'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-200/50 bg-white/50 hover:bg-white rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}