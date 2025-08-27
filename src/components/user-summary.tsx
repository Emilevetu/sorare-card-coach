import { SorareUser } from '../types/sorare';
import { User, Trophy, Star, Search } from 'lucide-react';
import { useState } from 'react';

interface UserSummaryProps {
  user: SorareUser;
  limitedCount: number;
  rareCount: number;
  totalCards: number;
  onSearch: (slug: string) => Promise<void>;
  isLoading: boolean;
}

export function UserSummary({ user, limitedCount, rareCount, totalCards, onSearch, isLoading }: UserSummaryProps) {
  const [slug, setSlug] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      await onSearch(slug.trim());
      setSlug(''); // Reset le champ après la recherche
    }
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border">
      <div className="flex items-start gap-6">
        {/* Section gauche - Informations utilisateur */}
        <div className="flex items-start gap-4 flex-1">
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

        {/* Section droite - Barre de recherche */}
        <div className="w-80">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="switch-user" className="block text-sm font-medium text-foreground mb-2">
                Changer d'utilisateur
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="switch-user"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Ex: emiliodelamuerte"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Entrez un autre slug Sorare pour changer d'utilisateur
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !slug.trim()}
              className="w-full bg-gradient-primary hover:opacity-90 disabled:opacity-50 transition-opacity text-white text-sm font-medium py-2 px-4 rounded-lg"
            >
              {isLoading ? 'Chargement...' : 'Changer d\'utilisateur'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}