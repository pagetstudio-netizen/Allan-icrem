import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import emptyImg from "@assets/waiting_(1)_1785698979439.svg";
import { getCountryByCode } from "@/lib/countries";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function maskId(id: number | string) {
  const s = String(id).padStart(6, "0");
  return s.slice(0, 6);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString("fr-FR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).replace(",", "");
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const country = getCountryByCode(user?.country || "");
  const currency = country?.currency || "FCFA";
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const { data: transactions = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id).catch(() => {});
    toast({ title: "ID copié !" });
  };

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div
      className="flex flex-col min-h-full pb-28"
      style={{ background: "linear-gradient(160deg,#FFF5EE 0%,#FAF0E0 50%,#FFF5EE 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate("/account")} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Facture</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-white/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <img src={emptyImg} alt="vide" className="w-36 h-36 mb-4 opacity-80" />
            <p className="text-gray-500 text-sm">Aucune transaction pour l'instant</p>
          </div>
        ) : (
          sorted.map((tx: any) => {
            const amount = parseFloat(tx.amount || 0);
            const isCredit = amount >= 0 &&
              ["bonus", "earning", "commission", "deposit", "gift", "staking_release", "withdrawal_refund"].includes(tx.type);
            const isDebit = ["withdrawal", "purchase", "fee"].includes(tx.type);
            const sign = isDebit ? "-" : "+";
            const amtColor = isDebit ? "#EF4444" : "#10b981";

            const typeLabels: Record<string, string> = {
              bonus: "Bonus d'inscription",
              earning: "Revenu quotidien",
              commission: "Commission parrainage",
              deposit: "Dépôt",
              withdrawal: "Retrait",
              purchase: "Acheter un produit",
              fee: "Frais",
              gift: "Code cadeau",
              staking_release: "Déblocage staking",
              withdrawal_refund: "Remboursement retrait",
            };
            const label = typeLabels[tx.type] || tx.description || tx.type;
            const shortId = maskId(tx.id);

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl px-4 py-3.5"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    <p className="text-gray-400 text-xs mt-1">{fmtDate(tx.createdAt)}</p>
                  </div>
                  {/* Right */}
                  <div className="text-right shrink-0">
                    <button
                      onClick={() => copyId(shortId)}
                      className="flex items-center gap-1 justify-end text-gray-400 text-xs mb-1 active:scale-95"
                    >
                      <span>{shortId}</span>
                      <span className="text-base">⎘</span>
                    </button>
                    <p className="font-black text-sm" style={{ color: amtColor }}>
                      {sign}{fmt(Math.abs(amount))} {currency}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating back button */}
      <button
        onClick={() => navigate("/account")}
        className="fixed bottom-24 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-20 active:scale-95 transition-transform"
        style={{ background: "#1B3A6B" }}
      >
        <span className="text-white font-bold text-sm">«</span>
      </button>
    </div>
  );
}
