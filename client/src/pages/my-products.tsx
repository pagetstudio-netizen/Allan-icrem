import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getCountryByCode } from "@/lib/countries";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ClipboardList } from "lucide-react";
import emptyImg from "@assets/waiting_(1)_1785698979439.svg";

import productImg1 from "@assets/allan_product_vip1.jpg";
import productImg2 from "@assets/allan_product_vip2.jpg";
import productImg3 from "@assets/allan_product_vip3.jpg";
import productImg4 from "@assets/allan_product_vip4.jpg";
import productImg5 from "@assets/allan_product_vip5.jpg";
import productImg6 from "@assets/allan_product_vip6.jpg";
import productImg7 from "@assets/allan_product_vip7.jpg";
import productImg8 from "@assets/allan_product_vip8.jpg";
import productImg9 from "@assets/allan_product_vip9.jpg";

const PRODUCT_IMAGES = [
  productImg1, productImg2, productImg3, productImg4, productImg5,
  productImg6, productImg7, productImg8, productImg9,
];

function useCountdown() {
  const getSecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  };
  const [secs, setSecs] = useState(getSecondsUntilMidnight());
  useEffect(() => {
    const id = setInterval(() => setSecs(s => (s > 0 ? s - 1 : getSecondsUntilMidnight())), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function MyProductsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"achete" | "expire">("achete");
  const countdown = useCountdown();

  const { data: userProducts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/user/products"],
  });

  if (!user) return null;

  const country = getCountryByCode(user.country);
  const currency = country?.currency || "FCFA";
  const allProducts = userProducts || [];

  const activeProducts = allProducts.filter((p: any) => p.isActive !== false && (p.daysRemaining ?? 1) > 0);
  const expiredProducts = allProducts.filter((p: any) => !p.isActive || (p.daysRemaining ?? 1) <= 0);
  const displayProducts = activeTab === "achete" ? activeProducts : expiredProducts;

  const totalDailyEarnings = activeProducts.reduce((s: number, p: any) => {
    return s + parseFloat(p.product?.dailyEarnings || 0);
  }, 0);

  const fmt = (n: number) => n.toLocaleString("fr-FR");
  const formatRemaining = (d: number) => {
    if (!d || d <= 0) return "Terminé";
    return `${Math.floor(d)}j 23h`;
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-center px-4 py-4"
        style={{ background: "rgba(20,5,60,0.6)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h1 className="text-white text-xl font-bold flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-amber-400" />
          Commande
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-28">

        {/* ── Stats Card ── */}
        <div
          className="mx-4 mt-4 rounded-2xl px-5 pt-4 pb-4"
          style={{
            background: "rgba(20,5,60,0.75)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <p className="text-white/60 text-sm mb-1">Revenu quotidien :</p>
          <p className="font-black text-2xl mb-3" style={{ color: "#F59E0B" }}>
            {fmt(totalDailyEarnings)} {currency}
          </p>

          {/* Progress bar */}
          <div className="w-full rounded-full mb-3" style={{ height: 8, background: "rgba(255,255,255,0.1)" }}>
            {totalDailyEarnings > 0 && (
              <div
                className="h-full rounded-full"
                style={{ width: "60%", background: "linear-gradient(90deg,#F5C518,#F59E0B)" }}
              />
            )}
          </div>

          {/* Timer row */}
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">
              en cours <span className="font-semibold text-white">{countdown}</span>
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#F5C518,#D97706)",
                boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
              }}
            >
              <span className="font-bold text-sm" style={{ color: "#3D1A00" }}>«</span>
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex mx-4 mt-4 rounded-xl overflow-hidden"
          style={{ background: "rgba(20,5,60,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {(["achete", "expire"] as const).map(t => {
            const isActive = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="flex-1 py-3 text-sm font-semibold text-center relative transition-colors"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)"
                    : "transparent",
                  color: isActive ? "#3D1A00" : "rgba(255,255,255,0.45)",
                  borderRadius: 10,
                }}
              >
                {t === "achete" ? "Acheté" : "Expiré"}
              </button>
            );
          })}
        </div>

        {/* ── Product List ── */}
        <div className="mx-4 mt-3 space-y-3">
          {isLoading ? (
            <div className="space-y-3 pt-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="h-28 rounded-2xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <img src={emptyImg} alt="vide" className="w-36 h-36 mb-4 opacity-60" />
              <p className="text-white/50 text-sm font-medium">
                {activeTab === "achete" ? "Aucun produit acheté" : "Aucun produit expiré"}
              </p>
              {activeTab === "achete" && (
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-6 py-2.5 rounded-full font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg,#F5C518,#D97706)",
                    color: "#3D1A00",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
                  }}
                >
                  Investir maintenant
                </button>
              )}
            </div>
          ) : (
            displayProducts.map((up: any, index: number) => {
              const cycleDays = up.product?.cycleDays || 30;
              const daysRemaining = Math.max(0, up.daysRemaining ?? cycleDays);
              const dailyEarnings = parseFloat(up.product?.dailyEarnings || 0);
              const totalRevenue = parseFloat(up.product?.totalReturn || cycleDays * dailyEarnings);
              const price = parseFloat(up.product?.price || 0);
              const img = PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
              const isExpired = activeTab === "expire";

              return (
                <div
                  key={up.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(20,5,60,0.75)",
                    border: "1px solid rgba(245,197,24,0.25)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  }}
                  data-testid={`commande-card-${up.id}`}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <p className="font-black text-white text-base">{up.product?.name || "Produit"}</p>
                    <p className="font-black text-base" style={{ color: "#F59E0B" }}>
                      {fmt(price)} {currency}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="flex items-start gap-3 px-4 pb-2">
                    <div className="shrink-0 rounded-xl overflow-hidden" style={{ width: 72, height: 72 }}>
                      <img src={img} alt={up.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs mb-0.5">
                        Revenu quotidien :{" "}
                        <span className="font-semibold text-white">{fmt(dailyEarnings)} {currency}</span>
                      </p>
                      <p className="text-white/60 text-xs mb-0.5">
                        Revenu total :{" "}
                        <span className="font-semibold text-white">{fmt(totalRevenue)} {currency}</span>
                      </p>
                      <p className="text-white/60 text-xs">
                        Durée :{" "}
                        <span className="font-semibold text-white">{cycleDays} jours</span>
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="px-4 pb-3 flex justify-end"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}
                  >
                    {isExpired ? (
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: "rgba(220,38,38,0.2)", color: "#FCA5A5" }}
                      >
                        Expiré
                      </span>
                    ) : (
                      <p className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
                        Restant : {formatRemaining(daysRemaining)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
