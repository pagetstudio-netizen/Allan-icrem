import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smile } from "lucide-react";
import { useLocation } from "wouter";
import { getCountryByCode } from "@/lib/countries";

interface WalletData {
  id: number;
  userId: number;
  accountName: string;
  accountNumber: string;
  paymentMethod: string;
  country: string;
  isDefault: boolean;
}

export default function WithdrawalPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [amount, setAmount] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [, navigate] = useLocation();

  const countryInfo = user ? getCountryByCode(user.country) : null;
  const currency = countryInfo?.currency || "FCFA";

  const { data: settings } = useQuery<{
    withdrawalFees: number;
    withdrawalStartHour: number;
    withdrawalEndHour: number;
    maxWithdrawalsPerDay: number;
    minWithdrawal: number;
    withdrawalDays: string;
  }>({ queryKey: ["/api/settings/withdrawal"], staleTime: 0 });

  const minWithdrawal = settings?.minWithdrawal ?? 2000;
  const fee = settings?.withdrawalFees ?? 20;
  const startHour = settings?.withdrawalStartHour ?? 9;
  const endHour = settings?.withdrawalEndHour ?? 17;
  const now = new Date();
  const isWithinHours = now.getHours() >= startHour && now.getHours() < endHour;

  const allowedDays = (settings?.withdrawalDays ?? "1,2,3,4,5,6,0")
    .split(",").map(d => parseInt(d.trim())).filter(n => !isNaN(n));
  const isTodayAllowed = allowedDays.includes(now.getDay());

  const { data: wallets = [], isLoading: walletsLoading } = useQuery<WalletData[]>({
    queryKey: ["/api/wallets"],
    refetchOnWindowFocus: true,
  });

  // Auto-select default wallet
  useEffect(() => {
    if (!selectedWallet && wallets.length > 0) {
      const def = wallets.find(w => w.isDefault) || wallets[0];
      setSelectedWallet(def);
    }
  }, [wallets, selectedWallet]);

  const balance = parseFloat(user?.balance || "0");
  const numAmount = parseFloat(amount) || 0;
  const netAmount = numAmount > 0 ? Math.floor(numAmount * (1 - fee / 100)) : 0;
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      if (!numAmount || numAmount < minWithdrawal) throw new Error(`Montant minimum : ${fmt(minWithdrawal)} ${currency}`);
      if (!selectedWallet) throw new Error("Sélectionnez un compte de retrait");
      if (!isTodayAllowed) throw new Error("Les retraits ne sont pas disponibles aujourd'hui");
      if (!isWithinHours) throw new Error(`Retraits disponibles de ${startHour}h à ${endHour}h`);
      const res = await apiRequest("POST", "/api/withdrawals", {
        amount: numAmount,
        walletId: selectedWallet.id,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      return data;
    },
    onSuccess: () => {
      toast({ title: "✅ Demande envoyée !", description: "Votre retrait est en cours de traitement." });
      refreshUser();
      qc.invalidateQueries({ queryKey: ["/api/withdrawals"] });
      setAmount("");
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  if (!user) return null;

  const withdrawalBlocked = !isTodayAllowed || !isWithinHours;

  /* ── Page wrapper ── */
  return (
    <div
      className="flex flex-col min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg,#FFF5EE 0%,#FAF0E0 60%,#FFF5EE 100%)" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate("/account")} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Retirer</h1>
      </div>

      {/* ══════════════════════════════════════════
          BLOCKED STATE — full-page blocked card
      ══════════════════════════════════════════ */}
      {withdrawalBlocked ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Icône cadenas */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
              boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
            }}
          >
            <Smile className="w-10 h-10 text-amber-500" />
          </div>

          <div
            className="w-full rounded-2xl px-6 py-6 text-center"
            style={{
              background: "#fff",
              border: "1.5px solid #F59E0B",
              boxShadow: "0 4px 20px rgba(245,158,11,0.15)",
            }}
          >
            <p className="font-black text-gray-900 text-base mb-2">
              Les retraits ne sont pas disponibles aujourd'hui.
            </p>
            <p className="font-semibold text-amber-600 text-sm mb-4">Revenez demain !</p>

            <div
              className="rounded-xl px-4 py-3 text-xs text-amber-700 text-left"
              style={{ background: "#FEF3C7" }}
            >
              <p className="font-semibold mb-1">Horaires de retrait :</p>
              <p>Du lundi au dimanche, de <strong>{startHour}h à {endHour}h</strong></p>
            </div>
          </div>
        </div>

      ) : (
        /* ══════════════════════════════════════════
            NORMAL STATE — full form
        ══════════════════════════════════════════ */
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4">

          {/* Balance card */}
          <div
            className="flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
          >
            <span className="font-bold text-white text-base">Mon solde</span>
            <span className="font-black text-white text-xl">
              {fmt(balance)} <span className="text-sm font-bold">{currency}</span>
            </span>
          </div>

          {/* Select wallet */}
          <div>
            <p className="font-bold text-gray-900 text-sm mb-3">Sélectionner le canal</p>
            {walletsLoading ? (
              <div className="flex gap-2">
                {[1,2].map(i => <div key={i} className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />)}
              </div>
            ) : wallets.length === 0 ? (
              <button
                onClick={() => navigate("/wallet")}
                className="px-5 py-2.5 rounded-full text-sm font-bold border-2 active:scale-95 transition-transform"
                style={{ borderColor: "#F59E0B", color: "#D97706", background: "transparent" }}
              >
                + Ajouter un compte
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                {wallets.map(w => {
                  const isSelected = selectedWallet?.id === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWallet(w)}
                      className="px-4 py-2 rounded-full text-sm font-bold border-2 active:scale-95 transition-all"
                      style={{
                        borderColor: isSelected ? "#F59E0B" : "#E5E7EB",
                        color: isSelected ? "#D97706" : "#6B7280",
                        background: isSelected ? "#FEF3C7" : "transparent",
                      }}
                    >
                      {w.paymentMethod} · {w.accountNumber.slice(-4)}
                    </button>
                  );
                })}
                <button
                  onClick={() => navigate("/wallet")}
                  className="px-4 py-2 rounded-full text-sm font-medium border-2 active:scale-95 transition-all"
                  style={{ borderColor: "#E5E7EB", color: "#9CA3AF" }}
                >
                  + Nouveau
                </button>
              </div>
            )}
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full" style={{ background: "#F59E0B" }} />
              <p className="font-bold text-gray-900 text-sm">Retrait de solde</p>
            </div>
            <div
              className="flex items-center rounded-2xl overflow-hidden"
              style={{ border: "1.5px solid #E5E7EB", background: "#fff" }}
            >
              <span className="px-4 py-4 text-sm font-semibold text-gray-500 border-r border-gray-200">
                {currency}
              </span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Montant du retrait"
                className="flex-1 px-4 py-4 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400"
                data-testid="input-withdrawal-amount"
              />
              <button
                onClick={() => setAmount(String(Math.floor(balance)))}
                className="mr-3 px-4 py-2 rounded-full text-xs font-bold shrink-0 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)", color: "#3D1A00" }}
              >
                Tout
              </button>
            </div>
            {numAmount > 0 && (
              <p className="text-xs text-gray-500 mt-2 pl-1">
                Vous recevrez :{" "}
                <span className="font-bold text-green-600">{fmt(netAmount)} {currency}</span>
                {" "}(frais {fee}%)
              </p>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={() => withdrawMutation.mutate()}
            disabled={withdrawMutation.isPending || !numAmount || !selectedWallet}
            className="w-full py-4 rounded-full font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
              color: "#3D1A00",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
            data-testid="button-submit-withdrawal"
          >
            {withdrawMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
              </span>
            ) : "Envoyer"}
          </button>

          {/* Rappel amical */}
          <div
            className="rounded-2xl px-5 py-5 bg-white"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}
          >
            <p className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                style={{ background: "#EF4444" }}
              >!</span>
              Rappel amical
            </p>
            <p className="text-gray-700 text-sm font-semibold mb-3">Règles de retrait :</p>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-900 shrink-0">1.</span>
                <p>
                  Montant minimum par retrait : <span className="font-semibold">{fmt(minWithdrawal)} {currency}</span><br />
                  Montant maximum par retrait : <span className="font-semibold">5 000 000 {currency}</span><br />
                  Un seul retrait autorisé par jour.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-900 shrink-0">2.</span>
                <p>
                  Horaires de retrait : du lundi au dimanche<br />
                  Chaque jour (de {startHour}h à {endHour}h).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-900 shrink-0">3.</span>
                <p>
                  Frais de retrait : <span className="font-semibold">{fee}%</span>. Les fonds seront disponibles sous 1 à 12 heures.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-900 shrink-0">4.</span>
                <p>
                  Assurez-vous que vos informations de réception sont correctes, sinon le retrait échouera.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
