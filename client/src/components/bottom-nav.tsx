import { useLocation } from "wouter";

import iconAccueil from "@assets/nav_accueil.png";
import iconCommande from "@assets/nav_commande.png";
import iconAvis from "@assets/nav_avis.png";
import iconEquipe from "@assets/nav_equipe.png";
import iconMoi from "@assets/nav_moi.png";

const navItems = [
  { path: "/", label: "Accueil", icon: iconAccueil, testId: "nav-accueil" },
  { path: "/commande", label: "Commande", icon: iconCommande, testId: "nav-commande" },
  { path: "/avis", label: "Avis", icon: iconAvis, testId: "nav-avis" },
  { path: "/team", label: "Équipe", icon: iconEquipe, testId: "nav-equipe" },
  { path: "/account", label: "Moi", icon: iconMoi, testId: "nav-moi" },
];

/* Gold filter for active icon */
const goldFilter =
  "brightness(0) saturate(100%) invert(70%) sepia(90%) saturate(500%) hue-rotate(5deg) brightness(105%)";

/* White filter for inactive icons */
const whiteFilter =
  "brightness(0) invert(1) opacity(0.7)";

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "#1a0533" }}
    >
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const isActive = location === item.path ||
            (item.path === "/commande" && location === "/my-products") ||
            (item.path === "/avis" && location === "/tasks");

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                // Fire welcome popup whenever home tab is tapped
                if (item.path === "/") {
                  window.dispatchEvent(new Event("showHomePopup"));
                }
              }}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 relative"
              data-testid={item.testId}
            >
              {/* Gold underline indicator for active */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                  style={{ width: 40, height: 3, background: "#F59E0B" }}
                />
              )}
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6"
                style={{ filter: isActive ? goldFilter : whiteFilter }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? "#F59E0B" : "rgba(255,255,255,0.65)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
