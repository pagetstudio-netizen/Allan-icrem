import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getCountryByCode } from "@/lib/countries";
import { ChevronLeft, Loader2, CalendarCheck } from "lucide-react";
import { Link } from "wouter";
import allanLogo from "@assets/allan_logo.jpg";

interface BonusStatus {
  canClaim: boolean;
  hoursRemaining: number;
  totalBonusClaimed: number;
  daysPointed: number;
}

export default function CheckinPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: bonusStatus } = useQuery<BonusStatus>({
    queryKey: ["/api/daily-bonus-status"],
    refetchInterval: 60000,
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/claim-daily-bonus", {});
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-bonus-status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Bonus reçu !", description: "50 FCFA ajoutés à votre solde" });
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  const country = getCountryByCode(user.country);
  const currency = country?.currency || "FCFA";
  const totalBonusClaimed = bonusStatus?.totalBonusClaimed || 0;
  const canClaim = bonusStatus?.canClaim ?? false;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      <div className="flex-1 overflow-y-auto pb-24">

        {/* ── Header ── */}
        <div className="relative flex items-center px-4 py-4">
          <Link href="/">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <p className="flex-1 text-center text-white font-bold text-lg">Check-in</p>
          <div className="w-9" />
        </div>

        {/* ── Logo circle ── */}
        <div className="flex justify-center mt-2">
          <div
            className="rounded-full overflow-hidden border-4"
            style={{
              width: 90, height: 90,
              borderColor: "#F59E0B",
              boxShadow: "0 0 20px rgba(245,158,11,0.5)",
            }}
          >
            <img src={allanLogo} alt="ALLAN" className="w-full h-full object-contain p-1 bg-white" />
          </div>
        </div>

        {/* ── Stats card ── */}
        <div
          className="mx-4 mt-5 rounded-2xl px-6 pt-6 pb-5"
          style={{
            background: "rgba(20,5,60,0.75)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Total */}
          <div className="text-center mb-5">
            <p className="text-white font-extrabold text-3xl">
              {totalBonusClaimed}{" "}
              <span className="text-xl font-bold uppercase">{currency}</span>
            </p>
            <p className="text-white/50 text-sm mt-1">Revenus cumulés</p>
          </div>

          {/* Two-column stats */}
          <div className="flex items-stretch">
            <div className="flex-1 flex flex-col items-center gap-1 pr-4"
              style={{ borderRight: "1px solid rgba(255,255,255,0.12)" }}>
              <p className="font-extrabold text-2xl" style={{ color: "#F59E0B" }}>
                50 <span className="text-base font-bold uppercase">{currency}</span>
              </p>
              <p className="text-white/50 text-xs text-center">Revenus du check-in quotidien</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 pl-4">
              <p className="font-extrabold text-2xl" style={{ color: "#F59E0B" }}>
                {totalBonusClaimed}{" "}
                <span className="text-base font-bold uppercase">{currency}</span>
              </p>
              <p className="text-white/50 text-xs text-center">Revenus cumulés</p>
            </div>
          </div>
        </div>

        {/* ── Check-in button ── */}
        <div className="mx-4 mt-5">
          {canClaim ? (
            <button
              onClick={() => claimMutation.mutate()}
              disabled={claimMutation.isPending}
              className="w-full py-4 rounded-full font-bold text-lg shadow-lg disabled:opacity-60 active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
                color: "#3D1A00",
                boxShadow: "0 6px 20px rgba(245,158,11,0.5)",
              }}
            >
              {claimMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Chargement...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CalendarCheck className="w-5 h-5" />
                  Check-in
                </span>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-4 rounded-full font-bold text-lg"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Revenir dans {bonusStatus?.hoursRemaining || 0}h
            </button>
          )}
        </div>

        {/* ── Rules ── */}
        <div
          className="mx-4 mt-5 rounded-2xl px-5 py-4 space-y-2"
          style={{
            background: "rgba(20,5,60,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-white/60 text-xs">
            1. Récompense de connexion quotidienne : 50 {currency}
          </p>
          <p className="text-white/60 text-xs">
            2. Connectez-vous une fois par jour pour accumuler des points.
          </p>
        </div>

      </div>
    </div>
  );
}
