import { CardWithPerformance } from '../types/sorare';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

interface CardsTableProps {
  cards: CardWithPerformance[];
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
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function getTrendIcon(l5: number, l15: number) {
  if (l5 > l15) return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (l5 < l15) return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

export function CardsTable({ cards }: CardsTableProps) {
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
              <TableHead className="font-semibold text-gray-900 py-4">Position</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Âge</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Club</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Ligue</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Rareté</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 text-right">XP</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Saison</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">L15</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">DNP%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCards.map((card) => (
              <TableRow key={card.id} className="border-gray-200/30 hover:bg-gray-50/50 transition-all duration-200">
                <TableCell className="font-medium">{card.player.displayName}</TableCell>
                <TableCell>{card.player.position}</TableCell>
                <TableCell>{card.player.age}</TableCell>
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
                <TableCell className="text-right font-mono font-medium">
                  {formatXP(card.xp)}
                </TableCell>
                <TableCell>{card.season.startYear}</TableCell>
                <TableCell>
                  {card.performance ? (
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${getPerformanceColor(card.performance.l15)}`}>
                        {card.performance.l15}
                      </span>
                      {getTrendIcon(card.performance.l5, card.performance.l15)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {card.performance ? (
                    <span className={`font-semibold ${card.performance.dnpPercentage > 25 ? 'text-red-600' : 'text-green-600'}`}>
                      {card.performance.dnpPercentage.toFixed(1)}%
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