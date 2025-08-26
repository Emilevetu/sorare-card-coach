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

          {/* 8. Règles par compétition */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-sorare-blue" />
                8. Règles par compétition (Sorare 26)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Arena */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  🎮 Arena
                </h3>
                
                <div className="bg-accent/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Règles générales</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Format :</strong> SO5 (5 cartes dont 1 capitaine)</li>
                    <li>• <strong>Capitaine :</strong> +20%</li>
                    <li>• <strong>Entrées :</strong> illimitées</li>
                    <li>• <strong>Matchmaking :</strong> arènes de 10 managers</li>
                    <li>• <strong>Golden Arena :</strong> 5% des arènes → podiums boostés</li>
                    <li>• <strong>Récompenses :</strong> Essence (type selon rareté jouée)</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <h4 className="font-semibold mb-3 text-green-700">Arena Capped</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Cap :</strong> somme L15 ≤ 260 (Common = 280)</li>
                      <li>• <strong>Bonus lineup :</strong> désactivés (pas de Cap Bonus, pas de Multi-Club)</li>
                      <li>• <strong>Coût entrée :</strong> 100 Essence (250 en Common)</li>
                      <li>• <strong>Récompenses :</strong> Essence selon rareté, barème fixe par arène</li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <h4 className="font-semibold mb-3 text-blue-700">Arena Uncapped</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Cap :</strong> aucun</li>
                      <li>• <strong>Bonus lineup :</strong> activés (Cap Bonus, Multi-Club)</li>
                      <li>• <strong>Coût entrée :</strong> 250 Essence</li>
                      <li>• <strong>Récompenses :</strong> Essence selon rareté</li>
                      <li>• <strong>Standard :</strong> 1er ~1250, 2e ~600, 3e ~400, 4e ~1000, 5e ~500</li>
                      <li>• <strong>Golden :</strong> 1er 3750, 2e 1500, 3e 750</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Top 5 Leagues */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  🏆 Top 5 Leagues (In-Season)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Premier League */}
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                      🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> joueurs Premier League uniquement</li>
                      <li>• <strong>Composition :</strong> min. 4 cartes In-Season (25/26) + max 1 Classique</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Divisions :</strong> D1, D2, D3 pour Limited et Rare</li>
                      <li>• <strong>Hot Streak :</strong> actif (seuils ~360 Limited, 400 Rare, boost x2)</li>
                      <li>• <strong>Récompenses :</strong> cash + Essence</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, Super Rare +40%, Unique +10% (en SR Extra)</li>
                    </ul>
                  </div>

                  {/* Ligue 1 */}
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <h4 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
                      🇫🇷 Ligue 1
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> joueurs Ligue 1 uniquement</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Hot Streak :</strong> actif (360 Limited, 400 Rare, boost x2)</li>
                      <li>• <strong>Récompenses :</strong> cash + Essence</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, Super Rare +40% (1 Unique Classic autorisée en extra)</li>
                    </ul>
                  </div>

                  {/* LaLiga */}
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <h4 className="font-semibold mb-3 text-yellow-700 flex items-center gap-2">
                      🇪🇸 LaLiga EA SPORTS
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> uniquement joueurs de LaLiga</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Hot Streak :</strong> actif (360 Limited, 400 Rare, boost x2)</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +40%, Unique +10% (extra SR)</li>
                    </ul>
                  </div>

                  {/* Bundesliga */}
                  <div className="bg-red-600/10 rounded-lg p-4 border border-red-600/20">
                    <h4 className="font-semibold mb-3 text-red-600 flex items-center gap-2">
                      🇩🇪 Bundesliga
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> joueurs Bundesliga uniquement</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Divisions :</strong> D1, D2, D3 pour Limited & Rare</li>
                      <li>• <strong>Hot Streak :</strong> actif (360 Limited, 400 Rare, boost x2)</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +40%, Unique +10% (extra SR)</li>
                    </ul>
                  </div>


                </div>
              </div>

              <Separator />

              {/* Other Leagues */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ⚽ Autres Ligues (In-Season)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Jupiler Pro League */}
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                      🇧🇪 Jupiler Pro League
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> joueurs de la Jupiler (Belgique)</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Hot Streak :</strong> actif</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +40%, Unique autorisée en extra SR</li>
                    </ul>
                  </div>

                  {/* Eredivisie */}
                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <h4 className="font-semibold mb-3 text-orange-700 flex items-center gap-2">
                      🇳🇱 Eredivisie
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> joueurs Eredivisie</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Hot Streak :</strong> 360 Limited, 400 Rare, boost x2</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +40% (+1 Unique Classic possible en extra)</li>
                    </ul>
                  </div>

                  {/* MLS */}
                  <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-600/20">
                    <h4 className="font-semibold mb-3 text-blue-600 flex items-center gap-2">
                      🇺🇸 MLS
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">MLS In-Season</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Format :</strong> SO5 (min. 4 In-Season)</li>
                          <li>• <strong>Éligibilité :</strong> joueurs MLS</li>
                          <li>• <strong>Capitaine :</strong> +50%</li>
                          <li>• <strong>Hot Streak :</strong> actif (Limited, Rare)</li>
                          <li>• <strong>Récompenses :</strong> cash + Essence</li>
                          <li>• <strong>SR & Unique :</strong> modes spécifiques avec Golden Goal (seuils 600+ SR, 650+ Unique → jackpot partagé)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">MLS Classic</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Format :</strong> SO5</li>
                          <li>• <strong>Éligibilité :</strong> MLS</li>
                          <li>• <strong>Récompenses :</strong> cartes + Essence (pas de cash)</li>
                          <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +20%, Unique +40%</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Challenger & Contender */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🌍 Compétitions Internationales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Challenger */}
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold mb-3 text-purple-700 flex items-center gap-2">
                      🌍 Challenger (In-Season)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> ligues suivantes :</li>
                      <li className="ml-4">Primeira Liga (Portugal), Süper Lig (Turquie), Danish Superliga, Austrian Bundesliga, Scottish Premiership, Serie A</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Hot Streak :</strong> 360 Limited, 400 Rare, boost x2</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +40%, Unique autorisée en extra SR</li>
                    </ul>
                  </div>

                  {/* Contender */}
                  <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/20">
                    <h4 className="font-semibold mb-3 text-pink-700 flex items-center gap-2">
                      🌍 Contender (In-Season)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO5</li>
                      <li>• <strong>Éligibilité :</strong> ligues hors Top 5 + Challenger</li>
                      <li className="ml-4">Ex. Brésil Série A, Liga MX, Argentine, Russie, Croatie, Suisse, J1 League, K League, Championship, etc.</li>
                      <li>• <strong>Composition :</strong> min. 4 In-Season</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Hot Streak :</strong> actif</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +40% (+1 Unique Classic autorisée en extra SR)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Classic Competitions */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  🌟 Compétitions Classiques (SO7)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Champion Europe */}
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <h4 className="font-semibold mb-3 text-yellow-700 flex items-center gap-2">
                      🌍 Champion Europe (Classic)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO7 (jusqu'à 7 cartes)</li>
                      <li>• <strong>Éligibilité :</strong> Top 5 ligues uniquement</li>
                      <li className="ml-4">PL, Bundesliga, LaLiga, Ligue 1, Serie A</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +20%, Unique +40%</li>
                      <li>• <strong>Récompenses :</strong> cartes (Star/Tier) + Essence</li>
                    </ul>
                  </div>

                  {/* U23 */}
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                      👶 U23 (Classic)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO7</li>
                      <li>• <strong>Éligibilité :</strong> joueurs ≤ 23 ans au 1er juillet 2025</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +20%, Unique +40%</li>
                      <li>• <strong>Récompenses :</strong> cartes + Essence</li>
                    </ul>
                  </div>

                  {/* All-Star */}
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold mb-3 text-purple-700 flex items-center gap-2">
                      🌟 All-Star (Classic)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format :</strong> SO7</li>
                      <li>• <strong>Éligibilité :</strong> toutes ligues</li>
                      <li>• <strong>Capitaine :</strong> +50%</li>
                      <li>• <strong>Bonus rareté :</strong> Rare +10%, SR +20%, Unique +40%</li>
                      <li>• <strong>Récompenses :</strong> cartes (Star, Tier) + Essence</li>
                    </ul>
                  </div>
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
