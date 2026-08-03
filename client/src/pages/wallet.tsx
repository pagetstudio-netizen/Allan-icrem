import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getCountryByCode, getPaymentMethodsForCountry, type ApiCountry } from "@/lib/countries";
import { useLocation, useSearch } from "wouter";
import { Eye, EyeOff, ChevronDown, CreditCard, Smartphone } from "lucide-react";
import type { WithdrawalWallet } from "@shared/schema";

export default function WalletPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const selectMode = params.get("from") === "withdrawal";

  const [showForm, setShowForm] = useState(false);
  const [showMethodSheet, setShowMethodSheet] = useState(false);

  // Form state
  const [accountName, setAccountName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const { data: wallets = [], isLoading } = useQuery<WithdrawalWallet[]>({ queryKey: ["/api/wallets"] });
  const { data: apiCountries = [] } = useQuery<ApiCountry[]>({ queryKey: ["/api/countries"] });
  const { data: reviews = [] } = useQuery<any[]>({ queryKey: ["/api/reviews"] });

  const country = getCountryByCode(user?.country || "");
  const currency = country?.currency || "FCFA";
  const balance = parseFloat(user?.balance || "0");
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const paymentMethods = getPaymentMethodsForCountry(user?.country || "", apiCountries.length ? apiCountries : undefined);

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!accountName.trim()) throw new Error("Nom requis");
      if (!paymentMethod) throw new Error("Méthode de paiement requise");
      if (!accountNumber.trim()) throw new Error("Numéro requis");
      const res = await apiRequest("POST", "/api/wallets", {
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        paymentMethod,
        country: user!.country,
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({ title: "✅ Compte ajouté !" });
      setAccountName(""); setPaymentMethod(""); setAccountNumber("");
      setShowForm(false);
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/wallets/${id}`, {});
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wallets"] }); toast({ title: "Supprimé" }); },
  });

  const maskPhone = (p: string) => {
    if (!p) return "****";
    const c = p.replace(/\s/g, "");
    if (c.length <= 6) return c;
    return c.slice(0, 5) + "****" + c.slice(-3);
  };

  // Compte De Retrait form view
  if (showForm) {
    return (
      <div className="flex flex-col min-h-full bg-white pb-28">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <button onClick={() => setShowForm(false)} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
          <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Compte De Retrait</h1>
        </div>

        <div className="px-5 pt-6 space-y-5 flex-1">
          {/* Nom */}
          <input
            type="text"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            placeholder="Entrez le nom d'utilisateur"
            className="w-full rounded-2xl px-4 py-4 text-sm outline-none"
            style={{ background: "#F2F4F8", color: "#111" }}
          />

          {/* Méthode dropdown */}
          <button
            onClick={() => setShowMethodSheet(true)}
            className="w-full rounded-2xl px-4 py-4 text-sm flex items-center justify-between"
            style={{ background: "#F2F4F8" }}
          >
            <span style={{ color: paymentMethod ? "#111" : "#9CA3AF" }}>
              {paymentMethod || "Entrez la carte bancaire"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Numéro */}
          <input
            type="tel"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            placeholder="Entrez le numéro de compte bancaire"
            className="w-full rounded-2xl px-4 py-4 text-sm outline-none"
            style={{ background: "#F2F4F8", color: "#111" }}
          />

          {/* Submit */}
          <button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending}
            className="w-full py-4 rounded-full font-black text-sm tracking-wider active:scale-[0.98] transition-transform mt-4"
            style={{
              background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
              color: "#3D1A00",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
          >
            {addMutation.isPending ? "..." : "SOUMETTRE"}
          </button>

          {/* Delete all link */}
          {wallets.length > 0 && (
            <button
              onClick={() => { if (confirm("Supprimer tous les comptes ?")) wallets.forEach(w => deleteMutation.mutate(w.id)); }}
              className="w-full text-center text-sm text-gray-500 underline mt-2 py-2"
            >
              Effacer le compte de retrait
            </button>
          )}
        </div>

        {/* Method sheet */}
        {showMethodSheet && (
          <div
            className="fixed inset-0 z-50 flex items-end"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowMethodSheet(false)}
          >
            <div
              className="w-full rounded-t-3xl p-6"
              style={{ background: "#fff" }}
              onClick={e => e.stopPropagation()}
            >
              <p className="font-bold text-gray-900 mb-4">Choisir la méthode</p>
              {paymentMethods.map(m => (
                <button
                  key={m}
                  onClick={() => { setPaymentMethod(m); setShowMethodSheet(false); }}
                  className="w-full py-3 px-4 text-left rounded-xl mb-2 font-medium text-gray-800"
                  style={{ background: paymentMethod === m ? "#FEF3C7" : "#F9FAFB" }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main wallet view
  return (
    <div className="flex flex-col min-h-full bg-white pb-28">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate("/account")} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Mon Portefeuille</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Balance card */}
        <div className="mx-4 mt-4">
          <div
            className="rounded-2xl px-5 py-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#1B4FA0 0%,#1565C0 50%,#0D47A1 100%)",
              boxShadow: "0 6px 24px rgba(27,79,160,0.4)",
            }}
          >
            {/* Background sparkles */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white/20"
                style={{ top: `${10 + i * 11}%`, left: `${5 + i * 12}%` }} />
            ))}
            <p className="text-white/70 text-sm mb-1">Solde disponible</p>
            <p className="text-white font-black text-4xl">{fmt(balance)}{currency}</p>
          </div>
        </div>

        {/* Retrait + Dépôt buttons */}
        <div className="flex gap-3 mx-4 mt-4">
          <button
            onClick={() => navigate("/withdrawal")}
            className="flex-1 py-3.5 rounded-full font-bold text-sm active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
              color: "#3D1A00",
              boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
            }}
          >
            Retrait
          </button>
          <button
            onClick={() => navigate("/deposit")}
            className="flex-1 py-3.5 rounded-full font-bold text-sm active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
              color: "#3D1A00",
              boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
            }}
          >
            Dépôt
          </button>
        </div>

        {/* Add account banner */}
        <div className="mx-4 mt-4">
          <div
            className="rounded-2xl px-4 py-4 flex items-center gap-3 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1B4FA0,#42A5F5)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Ajouter un compte Mobile Money</p>
              <p className="text-white/70 text-xs mt-0.5">Retrait d'argent rapide</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 px-4 py-2 rounded-full text-xs font-bold active:scale-95 transition-transform"
                style={{
                  background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
                  color: "#3D1A00",
                }}
              >
                Ajouter Maintenant
              </button>
            </div>
            {/* Card illustration */}
            <div
              className="w-20 h-14 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#F5C518,#F59E0B)", transform: "rotate(-8deg)", opacity: 0.9 }}
            >
              <CreditCard className="w-7 h-7 text-amber-900" />
            </div>
          </div>
        </div>

        {/* Saved wallets */}
        {wallets.length > 0 && (
          <div className="mx-4 mt-4">
            <p className="text-gray-700 font-bold text-sm mb-3">Comptes enregistrés</p>
            <div className="space-y-2">
              {wallets.map(w => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{ background: w.isDefault ? "#FEF3C7" : "#F9FAFB", border: w.isDefault ? "1px solid #F59E0B" : "1px solid #E5E7EB" }}
                  onClick={() => selectMode && (() => { localStorage.setItem("selectedWalletId", w.id.toString()); navigate("/withdrawal"); })()}
                >
                  <Smartphone className="w-5 h-5 text-gray-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{w.accountName}</p>
                    <p className="text-gray-400 text-xs">{w.paymentMethod} • {w.accountNumber}</p>
                  </div>
                  {w.isDefault && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#F59E0B", color: "#3D1A00" }}>Par défaut</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preuves de retrait */}
        <div className="mx-4 mt-5">
          <p className="text-gray-900 font-bold text-sm mb-3">Preuves de retrait</p>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-6">Aucune preuve pour l'instant</p>
          ) : (
            <div className="space-y-0">
              {reviews.map((r: any) => {
                const imgs: string[] = (() => { try { return JSON.parse(r.images); } catch { return []; } })();
                const vc = r.user?.country === "NE" ? "XOF" : "XAF";
                return (
                  <div key={r.id} className="flex items-start gap-3 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {maskPhone(r.whatsapp || r.user?.phone || "")}
                        <span className="font-black ml-1" style={{ color: "#E91E8C" }}>
                          +{parseFloat(r.amount).toLocaleString("fr-FR")}{vc}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">{r.comment}</p>
                    </div>
                    {imgs[0] && (
                      <div className="shrink-0 rounded-xl overflow-hidden" style={{ width: 72, height: 90 }}>
                        <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
