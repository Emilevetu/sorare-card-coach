import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (slug: string) => Promise<void>;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [slug, setSlug] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      await onSearch(slug.trim());
    }
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
            Slug Sorare
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
        
        <Button 
          type="submit" 
          disabled={isLoading || !slug.trim()}
          className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
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
      </form>
    </div>
  );
}