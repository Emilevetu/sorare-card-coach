import { Button } from '@/components/ui/button';
import { Home, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  currentPage: 'home' | 'rules';
}

export function Navigation({ currentPage }: NavigationProps) {
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-sorare-blue">Coach IA Sorare</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Accueil
              </Button>
            </Link>
            
            <Link to="/rules">
              <Button
                variant={currentPage === 'rules' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Règles du Jeu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
