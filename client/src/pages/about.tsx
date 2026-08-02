import { useLocation } from "wouter";

export default function AboutPage() {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col min-h-full bg-white pb-28">
      {/* Header */}
      <div
        className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10"
      >
        <button onClick={() => navigate("/account")} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">À Propos De Nous</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 text-gray-800 text-sm leading-relaxed">
        <p>
          ALLAN Construction est la plateforme d'investissement en ligne la plus rentable du Niger. Grâce à ses avantages uniques et à sa performance stable,
        </p>
        <p>
          ALLAN Construction est devenue le choix idéal pour les investisseurs souhaitant faire fructifier et préserver leur patrimoine.
        </p>
        <p className="font-bold">Pourquoi choisir ALLAN Construction ?</p>
        <p>
          <span className="font-semibold">Stable valeur :</span> Depuis sa création, ALLAN Construction est un symbole de richesse et de développement. En période de turbulences économiques, sa valeur reste non seulement stable, mais augmente souvent, ce qui en fait un placement de choix pour les investisseurs soucieux de réduire les risques.
        </p>
        <p>
          <span className="font-semibold">Fort potentiel de rendement :</span> Dans un contexte économique mondial en constante évolution, la demande de projets de construction ne cesse de croître. Investir via ALLAN Construction peut générer des plus-values considérables, notamment en période d'inflation et de dévaluation monétaire.
        </p>
        <p>
          <span className="font-semibold">Diversification du portefeuille :</span> Intégrer ALLAN Construction à votre portefeuille d'investissement permet de diversifier efficacement les risques et de renforcer la stabilité de votre patrimoine. ALLAN Construction propose une variété de produits d'investissement (VIP 1 à VIP 9) pour répondre aux besoins de chaque investisseur.
        </p>
        <p>
          <span className="font-semibold">Liquidité élevée :</span> Moyen d'échange internationalement reconnu, ALLAN Construction bénéficie d'une liquidité de marché extrêmement élevée. Les investisseurs peuvent acheter et vendre des actifs sur la plateforme ALLAN Construction à tout moment, ce qui leur garantit flexibilité et facilité d'utilisation de leurs fonds.
        </p>
        <p>
          <span className="font-semibold">Sécurité de la plateforme :</span> ALLAN Construction utilise les dernières technologies de cryptage pour protéger les fonds et les données personnelles de ses utilisateurs. Toutes les transactions sont sécurisées et transparentes.
        </p>
        <p>
          <span className="font-semibold">Programme de parrainage :</span> Gagnez des commissions en parrainant vos amis. Niveau 1 : 15%, Niveau 2 : 3%, Niveau 3 : 2% sur les dépôts de vos filleuls.
        </p>
        <p>
          <span className="font-semibold">Support 24/7 :</span> Notre équipe de support est disponible 24h/24 et 7j/7 pour répondre à toutes vos questions via WhatsApp et Telegram.
        </p>
        <p className="text-gray-400 text-xs pt-2">© 2026 ALLAN Construction — Tous droits réservés</p>
      </div>
    </div>
  );
}
