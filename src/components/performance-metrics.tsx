import { PlayerPerformance } from '../types/sorare';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetricsProps {
  performance: PlayerPerformance;
}

function getPerformanceColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function getDNPColor(percentage: number): string {
  if (percentage <= 10) return 'text-green-600';
  if (percentage <= 25) return 'text-yellow-600';
  if (percentage <= 50) return 'text-orange-600';
  return 'text-red-600';
}

export function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Performance {performance.displayName}</span>
          <Badge variant="outline">{performance.position}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métriques L5, L15, L40 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.l5)}`}>
              {performance.l5}
            </div>
            <div className="text-sm text-muted-foreground">L5</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.l15)}`}>
              {performance.l15}
            </div>
            <div className="text-sm text-muted-foreground">L15</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.l40)}`}>
              {performance.l40}
            </div>
            <div className="text-sm text-muted-foreground">L40</div>
          </div>
        </div>

        {/* DNP Percentage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Disponibilité</span>
            <span className={`font-semibold ${getDNPColor(performance.dnpPercentage)}`}>
              {performance.dnpPercentage.toFixed(1)}% DNP
            </span>
          </div>
          <Progress 
            value={100 - performance.dnpPercentage} 
            className="h-2"
          />
          <div className="text-xs text-muted-foreground text-center">
            {performance.gamesPlayed} matchs joués sur {performance.totalGames}
          </div>
        </div>

        {/* Score attendu calculé */}
        <div className="bg-accent/50 rounded-lg p-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              Score attendu: {calculateExpectedScore(performance)}
            </div>
            <div className="text-xs text-muted-foreground">
              Basé sur L15 + bonus disponibilité
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateExpectedScore(performance: PlayerPerformance): number {
  // Calcul simple du score attendu basé sur L15 et la disponibilité
  const baseScore = performance.l15;
  const availabilityBonus = (100 - performance.dnpPercentage) / 100;
  
  // Bonus de 10% si le joueur est très disponible
  const availabilityMultiplier = availabilityBonus > 0.8 ? 1.1 : 1.0;
  
  return Math.round(baseScore * availabilityMultiplier * 100) / 100;
}

