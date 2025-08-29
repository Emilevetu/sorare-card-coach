import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, LogOut } from 'lucide-react';

interface SearchFormProps {
  onSearch: (slug: string) => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
  currentUser?: string | null;
}

export function SearchForm({ onSearch, onLogout, isLoading, currentUser }: SearchFormProps) {
  const [slug, setSlug] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      await onSearch(slug.trim());
    }
  };

  const handleLogout = () => {
    setSlug('');
    onLogout();
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
            Slug Sorare (if you have over 200/300 cards it may break - feel free to try with Hissam's slug "hissam_")
          </label>
          <Input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Ex: emiliodelamuerte"
            className="w-full"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Entrez votre nom d'utilisateur Sorare pour voir vos cartes
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isLoading || !slug.trim()}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Rechercher mes cartes
              </>
            )}
          </Button>
          
          {currentUser && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoading}
              className="px-3"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}