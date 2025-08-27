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
      <div className="bg-gradient-hero text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-apple opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
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
          <Card className="bg-card border-border">
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
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
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
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="w-6 h-6 text-sorare-purple" />
                2. Arena (Modes permanents)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Arena Capped */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="text-lg font-semibold mb-3 text-center">Arena Capped</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Cap ≤ 260 L15</strong></li>
                    <li>• Aucun bonus activé</li>
                    <li>• Entrée coûte <Badge variant="secondary">100 Essence</Badge></li>
                  </ul>
                </div>

                {/* Arena Uncapped */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
                3. Hot Streaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="w-6 h-6 text-orange-600" />
                4. Sealing (Verrouillage de cartes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <ul className="space-y-2">
                  <li>• Tu peux verrouiller des cartes (Lock / "Sealing"), ce qui les rend non modifiables ni échangeables</li>
                  <li>• Cela contribue à ton "niveau de Sealing"</li>
                  <li>• Plus tu scelles de cartes (et de haute valeur), plus tu as de bonus en % sur tes récompenses (cash, essence, etc.) dans les compétitions permanentes (Classique et In‑Season)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 5. Collection Bonus */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Star className="w-6 h-6 text-yellow-600" />
                5. Collection Bonus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Principe général */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  📘 Sorare – Collection Rules & Bonuses
                </h3>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold mb-3">🔹 Principe général</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Chaque club licencié possède 1 collection par saison et rareté (sauf Common, non éligibles)</li>
                    <li>• Un album de collection = toutes les cartes d'un club spécifique pour une saison donnée (par rareté)</li>
                    <li>• Les cartes ajoutées donnent un Score de Collection, qui débloque un Bonus de Collection pour toutes les cartes de cet album</li>
                    <li>• ⚠️ 1 seule carte par joueur par album (pas de doublons). Si plusieurs versions existent, seule la carte avec le score le plus élevé compte</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Score de Collection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Comment est calculé le Score de Collection (par carte)</h3>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="mb-3">Chaque carte reçoit un score selon la Scoring Matrix :</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Baseline</strong> (toutes les cartes) : <Badge variant="secondary">+10 pts</Badge></li>
                    <li>• <strong>#1 Serial number</strong> (ex: carte n°1/100) : <Badge variant="secondary">+30 pts</Badge></li>
                    <li>• <strong>Serial = Jersey number</strong> (ex: carte n°10/100 pour un joueur qui porte le 10) : <Badge variant="secondary">+30 pts</Badge></li>
                    <li>• <strong>Special Card Edition</strong> (rookie, anniversaire, animée…) : <Badge variant="secondary">+20 pts</Badge></li>
                    <li>• <strong>One-owner card</strong> (jamais vendue depuis le mint) : <Badge variant="secondary">+20 pts</Badge></li>
                    <li>• <strong>Non listée / pas transférée depuis 30 jours</strong> : <Badge variant="secondary">+20 pts</Badge></li>
                  </ul>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h4 className="font-semibold mb-3 text-red-700">⚠️ Restrictions :</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Les cartes mises en vente, transférées ou incluses dans un trade au cours des 90 derniers jours → perdent le dernier bonus de +20 pts</li>
                    <li>• Les cartes listées actuellement ne reçoivent aucun score de collection (score redémarre quand elles sont retirées du marché)</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Bonus de Collection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Bonus de Collection (album entier)</h3>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="mb-3">Une fois le score total d'un album calculé, on applique le Bonus % suivant à toutes les cartes de l'album en compétition :</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="border border-border px-3 py-2 text-left font-semibold">Album Total Score</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold">Collection Bonus appliqué</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-border px-3 py-2">0 – 34 pts</td><td className="border border-border px-3 py-2"><Badge variant="outline">0%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">35 – 99 pts</td><td className="border border-border px-3 py-2"><Badge variant="outline">+1%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">100 – 249 pts</td><td className="border border-border px-3 py-2"><Badge variant="outline">+2%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">250 – 499 pts</td><td className="border border-border px-3 py-2"><Badge variant="outline">+3%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">500 – 749 pts</td><td className="border border-border px-3 py-2"><Badge variant="outline">+4%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">750+ pts</td><td className="border border-border px-3 py-2"><Badge variant="outline">+5%</Badge></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Règles spéciales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Règles spéciales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold mb-2">Special Edition Bonus</h4>
                    <p className="text-sm">Certaines éditions spéciales (Rookie, animée, etc.) ajoutent +20 pts au score. ⚠️ Non cumulatif → si une carte combine plusieurs éditions spéciales, seul un +20 pts max est appliqué.</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold mb-2">Transferts & ventes</h4>
                    <p className="text-sm">Si tu vends/échanges une carte, son score redémarre.</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold mb-2">Eligibilité</h4>
                    <p className="text-sm">Une carte garde son bonus uniquement pour le club affiché sur sa carte. Si le joueur change de club, elle reste liée à l'ancien.</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold mb-2">Durée de détention</h4>
                    <p className="text-sm">Plus tu gardes une carte sans la vendre/lister, plus tu conserves son plein score de collection.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Exemple concret */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Exemple concret</h3>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="mb-3">Supposons un album "PSG Limited 2025" avec 5 cartes :</p>
                  
                  <div className="space-y-3">
                    <div className="bg-green-500/10 rounded p-3 border border-green-500/20">
                      <p className="text-sm"><strong>Mbappé Rookie</strong> (#1/100, pas listée, 1 seul propriétaire) → 10 + 30 + 20 + 20 + 20 = <Badge variant="secondary">100 pts</Badge></p>
                    </div>
                    
                    <div className="bg-yellow-500/10 rounded p-3 border border-yellow-500/20">
                      <p className="text-sm"><strong>Hakimi carte simple</strong> (#23/100, listée récemment) → <Badge variant="secondary">10 pts</Badge></p>
                    </div>
                    
                    <div className="bg-blue-500/10 rounded p-3 border border-blue-500/20">
                      <p className="text-sm"><strong>Donnarumma carte spéciale Anniversary</strong>, non listée → 10 + 20 + 20 = <Badge variant="secondary">50 pts</Badge></p>
                    </div>
                    
                    <div className="bg-purple-500/10 rounded p-3 border border-purple-500/20">
                      <p className="text-sm"><strong>Vitinha carte #17/100</strong> (jersey = 17), non listée → 10 + 30 + 20 = <Badge variant="secondary">60 pts</Badge></p>
                    </div>
                    
                    <div className="bg-gray-500/10 rounded p-3 border border-gray-500/20">
                      <p className="text-sm"><strong>Marquinhos carte simple</strong>, vendue plusieurs fois → <Badge variant="secondary">10 pts</Badge></p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded border border-green-500/30">
                    <p className="text-sm font-semibold">Score total album = 230 pts → <Badge variant="secondary" className="font-bold">Bonus de +2%</Badge> appliqué à toutes ces cartes en compétition</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. XP, Niveaux & Bonus des Cartes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-blue-600" />
                6. XP, Niveaux & Bonus des Cartes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Principe général */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  📘 Sorare – XP, Niveaux & Bonus des Cartes
                </h3>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold mb-3">🔹 Principe général</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Les cartes gagnent de l'XP quand elles participent à des compétitions</li>
                    <li>• L'XP sert à faire monter de niveau les cartes → chaque niveau donne un bonus de % appliqué au score du joueur</li>
                    <li>• L'XP est spécifique au sport et à la rareté (ex: une carte Limited et une Rare du même joueur n'ont pas le même XP)</li>
                    <li>• Plafond : <Badge variant="secondary">30 000 XP max</Badge> par rareté</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Comment gagner de l'XP */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Comment gagner de l'XP</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold mb-2">En jouant une Game Week</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Formule :</strong> (score de base total de l'équipe / 5) → distribué en XP à chaque carte de l'équipe</li>
                      <li>• Le score de base = score sans bonus (pas d'XP, pas de collection, pas de capitaine)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold mb-2">En récompense de classement</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Dans les compétitions In-Season, les équipes classées entre top 30% et top 50% reçoivent <Badge variant="secondary">500 XP</Badge></li>
                      <li>• Événements spéciaux : Sorare distribue parfois de l'XP additionnel via missions / défis</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Barème XP & niveaux */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Barème XP & niveaux</h3>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="border border-border px-3 py-2 text-left font-semibold">Level</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold">XP to next level</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold">XP Accumulé</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold">Cooldown avant up suivant</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold">Bonus XP</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-border px-3 py-2">0</td><td className="border border-border px-3 py-2">0</td><td className="border border-border px-3 py-2">0</td><td className="border border-border px-3 py-2">–</td><td className="border border-border px-3 py-2"><Badge variant="outline">0%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">1</td><td className="border border-border px-3 py-2">200</td><td className="border border-border px-3 py-2">200</td><td className="border border-border px-3 py-2">1 jour</td><td className="border border-border px-3 py-2"><Badge variant="outline">+1%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">2</td><td className="border border-border px-3 py-2">400</td><td className="border border-border px-3 py-2">600</td><td className="border border-border px-3 py-2">1 semaine</td><td className="border border-border px-3 py-2"><Badge variant="outline">+2%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">3</td><td className="border border-border px-3 py-2">600</td><td className="border border-border px-3 py-2">1200</td><td className="border border-border px-3 py-2">2 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+3%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">4</td><td className="border border-border px-3 py-2">1000</td><td className="border border-border px-3 py-2">2200</td><td className="border border-border px-3 py-2">2 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+4%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">5</td><td className="border border-border px-3 py-2">1500</td><td className="border border-border px-3 py-2">3700</td><td className="border border-border px-3 py-2">2 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+5%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">6</td><td className="border border-border px-3 py-2">2000</td><td className="border border-border px-3 py-2">5700</td><td className="border border-border px-3 py-2">2 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+6%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">7</td><td className="border border-border px-3 py-2">3000</td><td className="border border-border px-3 py-2">8700</td><td className="border border-border px-3 py-2">4 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+7%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">8</td><td className="border border-border px-3 py-2">5000</td><td className="border border-border px-3 py-2">13700</td><td className="border border-border px-3 py-2">4 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+8%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">9</td><td className="border border-border px-3 py-2">7500</td><td className="border border-border px-3 py-2">21200</td><td className="border border-border px-3 py-2">6 semaines</td><td className="border border-border px-3 py-2"><Badge variant="outline">+9%</Badge></td></tr>
                        <tr><td className="border border-border px-3 py-2">10</td><td className="border border-border px-3 py-2">10000</td><td className="border border-border px-3 py-2">31200</td><td className="border border-border px-3 py-2">–</td><td className="border border-border px-3 py-2"><Badge variant="outline">+10%</Badge></td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-sm"><strong>Cooldown :</strong> après chaque montée de niveau, une carte doit patienter un certain temps avant de pouvoir monter à nouveau.</p>
                    <p className="text-sm"><strong>Max Bonus XP :</strong> <Badge variant="secondary">+10%</Badge> au niveau 10.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Impact des transferts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Impact des transferts sur l'XP</h3>
                
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <p className="text-sm">Lorsqu'une carte est vendue ou échangée sur le marché secondaire :</p>
                  <ul className="space-y-1 text-sm mt-2">
                    <li>• Elle perd <Badge variant="secondary">50% de son XP accumulé</Badge></li>
                    <li>• Son niveau est donc ajusté en conséquence</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Autres Bonus cumulables */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Autres Bonus cumulables avec XP</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold mb-2">Capitaine</h4>
                    <p className="text-sm">Selon la compétition, <Badge variant="outline">+0%</Badge>, <Badge variant="outline">+20%</Badge> ou <Badge variant="outline">+50%</Badge>.</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold mb-2">New Season Bonus (NSP)</h4>
                    <p className="text-sm">Cartes de la saison en cours → <Badge variant="secondary">+5%</Badge>.</p>
                    <p className="text-sm mt-1">⚠️ Expire 11 jours avant le premier match de la saison suivante.</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold mb-2">Collection Bonus</h4>
                    <p className="text-sm">Dépend du score de collection de ton album (<Badge variant="outline">0%</Badge> → <Badge variant="outline">+5%</Badge>).</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold mb-2">Bonus de rareté</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Rare</strong> → <Badge variant="outline">+10%</Badge></li>
                      <li>• <strong>Super Rare</strong> → <Badge variant="outline">+20%</Badge></li>
                      <li>• <strong>Unique</strong> → <Badge variant="outline">+40%</Badge></li>
                    </ul>
                    <p className="text-sm mt-1">(Appliqué selon la compétition)</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Statut In-Season */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔹 Statut In-Season</h3>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <ul className="space-y-2 text-sm">
                    <li>• Une carte est In-Season tant que la saison de la ligue de son club est active</li>
                    <li>• Perte du statut : 11 jours avant le premier match de la nouvelle saison de la ligue</li>
                    <li>• Quand une carte perd son statut In-Season → elle devient Classic Season et perd son NSP (<Badge variant="secondary">+5%</Badge>)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Divisions & Multi-Entries */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-sorare-blue" />
                7. Divisions & Multi-Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
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
          <Card className="bg-card border-border">
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
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
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
          <Card className="bg-card border-border">
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
