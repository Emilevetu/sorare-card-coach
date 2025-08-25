import { SorareUser } from '../types/sorare';
import { User, Trophy, Star } from 'lucide-react';

interface UserSummaryProps {
  user: SorareUser;
  limitedCount: number;
  rareCount: number;
  totalCards: number;
}

export function UserSummary({ user, limitedCount, rareCount, totalCards }: UserSummaryProps) {
  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-primary p-3 rounded-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {user.nickname || user.slug}
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            ID: {user.id} • Slug: @{user.slug}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                {totalCards} cartes
              </span>
            </div>
            
            {limitedCount > 0 && (
              <div className="flex items-center gap-2 bg-sorare-blue/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-sorare-blue" />
                <span className="text-sm font-medium text-sorare-blue">
                  {limitedCount} Limited
                </span>
              </div>
            )}
            
            {rareCount > 0 && (
              <div className="flex items-center gap-2 bg-sorare-purple/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-sorare-purple" />
                <span className="text-sm font-medium text-sorare-purple">
                  {rareCount} Rare+
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}