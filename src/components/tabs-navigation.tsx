import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, Trophy } from 'lucide-react';

interface TabsNavigationProps {
  children: React.ReactNode;
  gameWeeksContent: React.ReactNode;
}

export function TabsNavigation({ children, gameWeeksContent }: TabsNavigationProps) {
  return (
    <Tabs defaultValue="cards" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <Card className="w-4 h-4" />
          Mes Cartes
        </TabsTrigger>
        <TabsTrigger value="gameweeks" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          GameWeeks
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="cards" className="mt-6">
        {children}
      </TabsContent>
      
      <TabsContent value="gameweeks" className="mt-6">
        {gameWeeksContent}
      </TabsContent>
    </Tabs>
  );
}


