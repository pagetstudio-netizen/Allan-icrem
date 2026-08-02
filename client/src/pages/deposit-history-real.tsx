import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import emptyImg from "@assets/waiting_(1)_1785698979439.svg";
import { getCountryByCode } from "@/lib/countries";

interface Deposit {
  id: number;
  amount: string;
  status: string;
  paymentMethod?: string;
  channelName?: string;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).replace(",", "");
}

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  approved: { label: "Approuvé",   bg: "#D1FAE5", color: "#059669" },
  pending:  { label: "En attente", bg: "#FEF3C7", color: "#D97706" },
  rejected: { label: "Rejeté",     bg: "#FEE2E2", color: "#DC2626" },
};

export default function DepositHistoryRealPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const country = getCountryByCode(user?.country || "");
  const currency = country?.currency || "FCFA";
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const { data: deposits = [], isLoading } = useQuery<Deposit[]>({
    queryKey: ["/api/deposits/history"],
  });

  const sorted = [...deposits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div
      className="flex flex-col min-h-full pb-28"
      style={{ background: "linear-gradient(160deg,#FFF5EE 0%,#FAF0E0 50%,#FFF5EE 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate("/account")} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Historique des dépôts</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white/60 rounded-2xl animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <img src={emptyImg} alt="vide" className="w-36 h-36 mb-4 opacity-80" />
            <p className="text-gray-500 text-sm font-medium">Aucun dépôt effectué</p>
            <p className="text-gray-400 text-xs mt-1">Vos dépôts apparaîtront ici</p>
          </div>
        ) : (
          sorted.map(d => {
            const st = STATUS[d.status] || { label: d.status, bg: "#F3F4F6", color: "#6B7280" };
            const amount = parseFloat(d.amount || "0");
            return (
              <div
                key={d.id}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                data-testid={`deposit-item-${d.id}`}
              >
                {/* Top accent */}
                <div className="h-1 w-full rounded-t-2xl"
                  style={{ background: d.status === "approved" ? "#10b981" : d.status === "rejected" ? "#EF4444" : "#F59E0B" }} />

                <div className="px-4 py-4 space-y-2.5">
                  {/* Amount */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Montant</span>
                    <span className="font-black text-base" style={{ color: "#1B4FA0" }}>
                      +{fmt(amount)} {currency}
                    </span>
                  </div>

                  {/* Channel */}
                  {(d.channelName || d.paymentMethod) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Méthode</span>
                      <span className="text-gray-700 text-xs font-medium">{d.channelName || d.paymentMethod}</span>
                    </div>
                  )}

                  {/* Status + date */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-400 text-xs">{fmtDate(d.createdAt)}</span>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating back */}
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
