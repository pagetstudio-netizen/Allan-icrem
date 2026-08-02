import { useAuth } from "@/lib/auth";
import { Loader2, X, Megaphone } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCountryByCode, formatCurrency } from "@/lib/countries";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import popupGoldCoins from "@assets/popup_gold_coins.png";

import productImg1 from "@assets/allan_product_vip1.jpg";
import productImg2 from "@assets/allan_product_vip2.jpg";
import productImg3 from "@assets/allan_product_vip3.jpg";
import productImg4 from "@assets/allan_product_vip4.jpg";
import productImg5 from "@assets/allan_product_vip5.jpg";
import productImg6 from "@assets/allan_product_vip6.jpg";
import productImg7 from "@assets/allan_product_vip7.jpg";
import productImg8 from "@assets/allan_product_vip8.jpg";
import productImg9 from "@assets/allan_product_vip9.jpg";
import bannerDefiCash from "@assets/banner_defi_cash.jpg";
import iconDepot from "@assets/action_depot.png";
import iconRetrait from "@assets/action_retrait.png";
import iconTelegram from "@assets/action_telegram.png";
import iconMessage from "@assets/action_message.png";
import iconArgent from "@assets/action_argent.png";

const PRODUCT_IMAGES = [
  productImg1, productImg2, productImg3, productImg4, productImg5,
  productImg6, productImg7, productImg8, productImg9,
];

interface ProductWithOwnership extends Product {
  isOwned: boolean;
  canClaimFree: boolean;
  ownedCount?: number;
}

/* ── Marquee component ── */
function Marquee({ messages }: { messages: string[] }) {
  const text = messages.join("   |   ");
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-full overflow-hidden"
      style={{ background: "linear-gradient(90deg,#F59E0B,#FBBF24)" }}
    >
      <Megaphone className="w-4 h-4 shrink-0" />
      <div className="flex-1 overflow-hidden">
        <div
          className="whitespace-nowrap text-white text-sm font-semibold"
          style={{
            animation: "marquee 18s linear infinite",
          }}
        >
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, refreshUser } = useAuth();
  const [, navigate] = useLocation();
  const [confirmProduct, setConfirmProduct] = useState<ProductWithOwnership | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const { toast } = useToast();

  // Show popup on mount and on every "showHomePopup" custom event (fired by bottom-nav)
  useEffect(() => {
    setShowWelcomePopup(true);
    const handler = () => setShowWelcomePopup(true);
    window.addEventListener("showHomePopup", handler);
    return () => window.removeEventListener("showHomePopup", handler);
  }, []);

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithOwnership[]>({
    queryKey: ["/api/products"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", `/api/products/${productId}/purchase`, {});
      if (!response.ok) { const d = await response.json(); throw new Error(d.message || "Erreur"); }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/products"] });
      refreshUser();
      setConfirmProduct(null);
      toast({ title: "Produit acheté !", description: "Vous commencerez à recevoir des gains demain." });
    },
    onError: (error: any) => {
      setConfirmProduct(null);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  const country = getCountryByCode(user.country);
  const currency = country?.currency || "FCFA";
  const balance = parseFloat(user.balance || "0");
  const telegramLink = settings?.groupLink || "https://t.me/allaninvest";

  const paidProducts = products?.filter(p => !p.isFree) || [];

  const marqueeMessages = [
    "Bienvenue sur ALLAN Investissement",
    "057****397 Retrait 2 000",
    "088****142 Retrait 5 000",
    "Investissez aujourd'hui, bâtissez votre avenir !",
    "077****853 Retrait 10 000",
  ];

  const quickActions = [
    { label: "Dépôt", icon: iconDepot, path: "/deposit", badge: null, testId: "button-depot" },
    { label: "Retrait", icon: iconRetrait, path: "/withdrawal", badge: null, testId: "button-retrait" },
    { label: "canal de\ntélégramme", icon: iconTelegram, path: telegramLink, external: true, badge: null, testId: "button-telegram" },
    { label: "Message", icon: iconMessage, path: "/service", badge: "4", testId: "button-message" },
    { label: "Argent\ngratuit", icon: iconArgent, path: "/checkin", badge: null, testId: "button-argent" },
  ];

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: "linear-gradient(180deg, #7B2FBE 0%, #5B1A9B 100%)" }}
    >
      {/* ── Marquee CSS ── */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-white text-2xl font-bold">Accueil</h1>
      </div>

      {/* ── Balance Card ── */}
      <div className="mx-4 mb-3">
        <div
          className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.25)",
            border: "2px dashed #F59E0B",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">👜</span>
            <div>
              <p className="text-white/70 text-xs font-medium">Solde({currency})</p>
            </div>
          </div>
          <p className="text-white text-3xl font-black">{balance.toLocaleString("fr-FR")}</p>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="mx-4 mb-4">
        <Marquee messages={marqueeMessages} />
      </div>

      {/* ── Quick Actions ── */}
      <div className="mx-4 mb-4">
        <div className="flex justify-between items-start">
          {quickActions.map((action) => (
            <button
              key={action.testId}
              onClick={() => action.external ? window.open(action.path, "_blank") : navigate(action.path)}
              className="flex flex-col items-center gap-1.5"
              style={{ width: "18%" }}
              data-testid={action.testId}
            >
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: "linear-gradient(145deg,#FBBF24,#F59E0B)" }}
                >
                  <img src={action.icon} alt={action.label} className="w-9 h-9 object-contain" />
                </div>
                {action.badge && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    style={{ background: "#EF4444" }}
                  >
                    {action.badge}
                  </span>
                )}
              </div>
              <span
                className="text-white text-[10px] font-medium text-center leading-tight"
                style={{ whiteSpace: "pre-line" }}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Défi Cash Banner ── */}
      <div className="mx-4 mb-5">
        <button
          onClick={() => navigate("/wheel")}
          className="w-full rounded-2xl overflow-hidden shadow-xl block"
          style={{ height: 110 }}
        >
          <img
            src={bannerDefiCash}
            alt="Défi Cash"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* ── Projet Principal ── */}
      <div className="mx-4 mb-4">
        <h2 className="text-white text-base font-bold mb-3">🧘 Projet principal</h2>

        {productsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-36 bg-purple-400/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : paidProducts.length > 0 ? (
          <div className="space-y-4">
            {paidProducts.map((product, idx) => {
              const img = PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length];
              return (
                <div
                  key={product.id}
                  className="rounded-2xl overflow-hidden shadow-lg"
                  style={{ background: "linear-gradient(135deg,#FCD34D,#FBBF24)" }}
                  data-testid={`home-product-card-${product.id}`}
                >
                  {/* Top section: image + details */}
                  <div className="flex" style={{ minHeight: 110 }}>
                    {/* Left: image */}
                    <div className="shrink-0 overflow-hidden rounded-tl-2xl rounded-bl-2xl" style={{ width: 120 }}>
                      <img src={img} alt={product.name} className="w-full h-full object-cover" style={{ minHeight: 110 }} />
                    </div>
                    {/* Right: details */}
                    <div className="flex-1 px-3 py-3 relative">
                      <p className="text-gray-900 font-bold text-sm mb-1.5 leading-tight">{product.name}</p>
                      <p className="text-gray-600 text-xs">Cycle(Jours): <span className="text-gray-800 font-medium">{product.cycleDays}</span></p>
                      <p className="text-gray-600 text-xs">Disponible: <span className="text-gray-800 font-medium">10/10</span></p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <p className="text-gray-600 text-xs">Revenu quotidien({currency})</p>
                      </div>
                      <p className="font-bold text-xs" style={{ color: "#E05A00" }}>{Number(product.dailyEarnings).toLocaleString("fr-FR")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-gray-600 text-xs">Revenu total({currency})</p>
                        {product.canClaimFree && (
                          <span
                            className="text-[9px] text-white font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: "#EF4444" }}
                          >
                            Free Cash
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs" style={{ color: "#E05A00" }}>{Number(product.totalReturn).toLocaleString("fr-FR")}</p>
                    </div>
                  </div>

                  {/* Invest button */}
                  <div className="px-3 pb-3 pt-1">
                    <button
                      onClick={() => setConfirmProduct(product)}
                      className="w-full py-2.5 rounded-xl text-gray-900 font-extrabold text-sm shadow-md"
                      style={{ background: "linear-gradient(90deg,#FBBF24,#F59E0B)" }}
                      data-testid={`button-home-purchase-${product.id}`}
                    >
                      {Number(product.price).toLocaleString("fr-FR")} INVESTIR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-white/60 text-sm">Aucun produit disponible</div>
        )}
      </div>

      <div className="pb-28" />

      {/* ── Welcome Popup ── */}
      {showWelcomePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowWelcomePopup(false)}
        >
          <div
            className="relative w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            {/* ── Envelope outer (gold) ── */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg,#F5C518,#F59E0B,#D97706)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px rgba(245,197,24,0.3)",
                padding: "3px",
              }}
            >
              <div
                className="rounded-[22px] overflow-hidden"
                style={{ background: "linear-gradient(145deg,#F5C518,#E88C00)" }}
              >
                {/* ── Purple card (top of envelope) ── */}
                <div
                  className="mx-3 mt-3 rounded-2xl px-5 pt-5 pb-4 relative"
                  style={{
                    background: "linear-gradient(160deg,#3D1060,#2A0C4E,#1E0838)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* X Close button */}
                  <button
                    onClick={() => setShowWelcomePopup(false)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                    data-testid="button-close-welcome-popup"
                  >
                    <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </button>

                  {/* Text content */}
                  <p className="text-white font-black text-base text-center leading-snug mb-3">
                    Bienvenue chez Allan
                  </p>
                  <div
                    className="w-10 mx-auto mb-3"
                    style={{ borderBottom: "1px dashed rgba(255,255,255,0.3)" }}
                  />
                  <p className="text-white/85 text-sm text-center leading-relaxed mb-4">
                    Votre avis est très important pour nous. Si vous avez des suggestions ou des commentaires, faites-le nous savoir afin que nous puissions continuer à nous améliorer
                  </p>
                  <p className="text-white/70 text-sm text-center font-semibold">
                    Rejoindre notre communauté Telegram
                  </p>
                </div>

                {/* ── Telegram button ── */}
                <div className="px-6 pb-5 pt-1">
                  <button
                    onClick={() => {
                      setShowWelcomePopup(false);
                      window.open(telegramLink, "_blank");
                    }}
                    className="w-full py-4 rounded-full font-black text-white text-lg tracking-widest uppercase active:scale-[0.97] transition-transform"
                    style={{
                      background: "linear-gradient(135deg,#2563EB,#3B82F6,#60A5FA)",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.6)",
                      letterSpacing: "0.1em",
                    }}
                    data-testid="button-popup-telegram"
                  >
                    TELGRAM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Purchase confirm modal ── */}
      {confirmProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60"
          onClick={() => setConfirmProduct(null)}
        >
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div
              className="pt-5 pb-3 text-center px-6"
              style={{ background: "linear-gradient(135deg,#7B2FBE,#5B1A9B)" }}
            >
              <h3 className="text-xl font-bold text-white">ALLAN {confirmProduct.name}</h3>
              <p className="text-xs text-white/70 mt-1">Gains versés toutes les 24 heures</p>
            </div>
            <div className="flex justify-center px-6 py-3">
              <img
                src={PRODUCT_IMAGES[(confirmProduct.sortOrder || 0) % PRODUCT_IMAGES.length]}
                alt={confirmProduct.name}
                className="w-36 h-28 object-cover rounded-2xl shadow"
              />
            </div>
            <div className="px-6 pb-2 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Prix :</span>
                <span className="font-bold text-sm" style={{ color: "#E05A00" }}>{currency} {Number(confirmProduct.price).toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Revenu quotidien :</span>
                <span className="font-bold text-sm" style={{ color: "#E05A00" }}>{currency} {Number(confirmProduct.dailyEarnings).toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Revenu total :</span>
                <span className="font-bold text-sm" style={{ color: "#E05A00" }}>{currency} {Number(confirmProduct.totalReturn).toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Durée :</span>
                <span className="text-gray-900 font-bold text-sm">{confirmProduct.cycleDays} jours</span>
              </div>
              {balance < confirmProduct.price && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs text-red-500">
                    Solde insuffisant. Il vous manque {formatCurrency(confirmProduct.price - balance, user.country)}.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-5">
              <button
                onClick={() => setConfirmProduct(null)}
                className="flex-1 py-3 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm"
                data-testid="button-cancel-purchase"
              >
                Annuler
              </button>
              <button
                onClick={() => purchaseMutation.mutate(confirmProduct.id)}
                disabled={purchaseMutation.isPending || balance < confirmProduct.price}
                className="flex-1 py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
                data-testid="button-confirm-purchase"
              >
                {purchaseMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className="text-gray-900 font-extrabold">Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
