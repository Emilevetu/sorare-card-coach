import { SorareCard } from '../types/sorare';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CardsTableProps {
  cards: SorareCard[];
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

export function CardsTable({ cards }: CardsTableProps) {
  if (cards.length === 0) {
    return (
      <div className="bg-gradient-card rounded-xl p-8 shadow-card border border-border text-center">
        <p className="text-muted-foreground">Aucune carte trouvée avec les filtres actuels.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-xl shadow-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="font-semibold">Joueur</TableHead>
              <TableHead className="font-semibold">Position</TableHead>
              <TableHead className="font-semibold">Club</TableHead>
              <TableHead className="font-semibold">Âge</TableHead>
              <TableHead className="font-semibold">U23</TableHead>
              <TableHead className="font-semibold">Rareté</TableHead>
              <TableHead className="font-semibold text-right">XP</TableHead>
              <TableHead className="font-semibold">Saison</TableHead>
              <TableHead className="font-semibold">Slug carte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card) => (
              <TableRow key={card.id} className="border-border hover:bg-accent/50 transition-smooth">
                <TableCell className="font-medium">{card.player.displayName}</TableCell>
                <TableCell>{card.player.position}</TableCell>
                <TableCell>{card.player.activeClub?.name || '—'}</TableCell>
                <TableCell>{card.player.age}</TableCell>
                <TableCell>
                  <Badge variant={card.player.u23Eligible ? 'default' : 'secondary'} className="text-xs">
                    {card.player.u23Eligible ? 'Oui' : 'Non'}
                  </Badge>
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
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[150px] truncate">
                  {card.slug}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}