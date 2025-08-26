import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Users, Lock, Star, Target, Award, TrendingUp, Shield } from 'lucide-react';
import { Navigation } from '../components/navigation';

export function Rules() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation currentPage="rules" />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Règles du Jeu Sorare
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Guide complet des mécaniques et bonus du fantasy football Sorare
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          
          {/* 1. Lineup Bonuses */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-sorare-blue" />
                1. Lineup Bonuses (Bonifications de composition)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Cap Bonus */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Cap Bonus
                </h3>
                <div className="bg-accent/50 rounded-lg p-4">
                  <p className="mb-2">
                    Obtiens un bonus de <Badge variant="secondary" className="font-bold">+4%</Badge> sur le score total de ta composition si la somme des scores L15 des joueurs reste strictement inférieure ou égale à :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>260</strong> pour les compositions sur 5 joueurs (In‑Season / Classic)</li>
                    <li><strong>370</strong> pour les compétitions Classic en SO7 (7 joueurs)</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Multi-Club Bonus */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Multi‑Club Bonus
                </h3>
                <div className="bg-accent/50 rounded-lg p-4">
                  <p className="mb-2">
                    Obtiens un bonus de <Badge variant="secondary" className="font-bold">+2%</Badge> si ta composition contient au maximum deux joueurs du même club.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Note :</strong> ce bonus est désactivé dans All‑Star et U23 durant les trêves internationales (car les joueurs peuvent changer d'équipe nationale).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Arena */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="w-6 h-6 text-sorare-purple" />
                2. Arena (Modes permanents)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Arena Capped */}
                <div className="bg-accent/50 rounded-lg p-4 border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-center">Arena Capped</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Cap ≤ 260 L15</strong></li>
                    <li>• Aucun bonus activé</li>
                    <li>• Entrée coûte <Badge variant="secondary">100 Essence</Badge></li>
                  </ul>
                </div>

                {/* Arena Uncapped */}
                <div className="bg-accent/50 rounded-lg p-4 border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-center">Arena Uncapped</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Pas de cap</strong></li>
                    <li>• Tous les bonus s'appliquent (Cap + Multi‑Club, etc.)</li>
                    <li>• Entrée coûte <Badge variant="secondary">250 Essence</Badge></li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Golden Arenas
                </h4>
                <p className="text-sm">
                  Dans chaque salle d'Arena, les <strong>5% premiers managers</strong> bénéficient de récompenses boostées (podiums augmentés).
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  Ces modes sont permanents, accessibles à chaque Game Week, même en semaine, avec entrées illimitées.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Hot Streaks */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
                3. Hot Streaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li>• Disponible dans toutes les compétitions <strong>In-Season</strong> (Limited & Rare)</li>
                  <li>• Fonctionne sur système de <strong>paliers de points</strong> : plus tu atteins de points dans une GW, plus tu gagnes de cash (ou ETH) et tu montes de "niveau"</li>
                  <li>• Une composition reste éligible si elle contient <strong>4 cartes In‑Season + 1 carte Classique</strong></li>
                  <li>• Les seuils de points, niveaux et tableaux de récompenses sont communiqués avant le lancement de la saison</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 4. Sealing */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="w-6 h-6 text-orange-600" />
                4. Sealing (Verrouillage de cartes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-accent/50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li>• Tu peux verrouiller des cartes (Lock / "Sealing"), ce qui les rend non modifiables ni échangeables</li>
                  <li>• Cela contribue à ton "niveau de Sealing"</li>
                  <li>• Plus tu scelles de cartes (et de haute valeur), plus tu as de bonus en % sur tes récompenses (cash, essence, etc.) dans les compétitions permanentes (Classique et In‑Season)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 5. Collection Bonus */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Star className="w-6 h-6 text-yellow-600" />
                5. Collection Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-accent/50 rounded-lg p-4">
                <p>
                  Si tu possèdes une carte pendant au moins <strong>30 jours</strong> sans la lister sur le marché, tu obtiens un bonus de <Badge variant="secondary" className="font-bold">+20 points</Badge> ajoutés à son score.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Bonus de Capitaine, de Niveau & New-Season */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-blue-600" />
                6. Bonus de Capitaine, de Niveau & New-Season (NSP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Bonus de capitaine</h4>
                  <p className="text-sm">Peut être <strong>0%</strong>, <strong>20%</strong> ou <strong>50%</strong> selon la compétition</p>
                </div>
                
                <div className="bg-accent/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Bonus de niveau (XP)</h4>
                  <p className="text-sm">Dépend du niveau de la carte (XP accumulé) et de sa rareté</p>
                </div>
                
                <div className="bg-accent/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">New‑Season Bonus (NSP)</h4>
                  <p className="text-sm">Cartes de la saison en cours bénéficient de <strong>+5%</strong></p>
                </div>
              </div>

              <Separator />

              <div className="bg-accent/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">XP et niveaux :</h4>
                <ul className="space-y-2 text-sm">
                  <li>• XP se gagne chaque semaine selon performance ou événements spéciaux</li>
                  <li>• Il existe un plafond de <strong>30 000 XP</strong> par rareté</li>
                  <li>• Le score de base (sans bonus) d'une composition permet de générer de l'XP divisé par 5</li>
                  <li>• <strong>Attention :</strong> si une carte est vendue, son XP chute de 50%</li>
                  <li>• Après un level-up, il y a une période de cooldown avant de pouvoir monter une nouvelle fois</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 7. Divisions & Multi-Entries */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-sorare-blue" />
                7. Divisions & Multi-Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="mb-3">
                  Tu peux envoyer jusqu'à <strong>4 compositions</strong> par compétition (In-Season ou Classic) dès le début de la saison (possibilité débloquée par défaut).
                </p>
                <p>
                  Trois divisions existent : <Badge variant="secondary">D1</Badge>, <Badge variant="secondary">D2</Badge>, <Badge variant="secondary">D3</Badge>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Promotions */}
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-semibold mb-3 text-green-700">Promotions</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>D3 → D2 :</strong> Top 30% promu</li>
                    <li>• <strong>D2 → D1 :</strong> Top 15% promu</li>
                  </ul>
                </div>

                {/* Rélegations */}
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h4 className="font-semibold mb-3 text-red-700">Rélegations</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>D2 → D3 :</strong> Bottom 30% relégué</li>
                    <li>• <strong>D1 → D2 :</strong> Bottom 30% relégué</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format synthétique */}
          <Card className="bg-gradient-to-r from-sorare-blue/10 to-sorare-purple/10 border-sorare-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                📋 Format synthétique (Coach IA friendly)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Cap Bonus :</strong> +4% si L15 total ≤ 260 (ou ≤ 370 en SO7)</p>
                  <p><strong>Multi-Club Bonus :</strong> +2% si ≤ 2 joueurs du même club</p>
                  <p><strong>Arena Capped :</strong> entrée 100 Essence, cap 260, pas de bonus</p>
                  <p><strong>Arena Uncapped :</strong> entrée 250 Essence, bonus activés, Golden Arenas (top 5% podium boosté)</p>
                  <p><strong>Hot Streaks :</strong> niveaux/paliers de points → cash; nécessite 4 cartes In-Season + 1 classique</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Sealing :</strong> verrouillage → plus tu as de cartes verrouillées, plus tes récompenses augmentent</p>
                  <p><strong>Collection Bonus :</strong> +20 points après 30 jours de possession</p>
                  <p><strong>Bonus Capitaine :</strong> 0% / 20% / 50%, selon compétition</p>
                  <p><strong>XP/Niveau :</strong> XP gagné par GW; cap 30k/rareté; score/5 = XP; cooldown et perte XP à la vente</p>
                  <p><strong>Entrées multiples & Divisions :</strong> jusqu'à 4 comps par GW; divisions D1–D3 avec promo/régé</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
