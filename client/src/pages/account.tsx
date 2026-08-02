import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { getCountryByCode } from "@/lib/countries";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, Wallet, Headphones, KeyRound, Info, LogOut,
} from "lucide-react";

import allanLogo from "@assets/allan_logo_new.jpg";
import iconDepot from "@assets/téléchargement_(76)_1785698869028.png";
import iconRetrait from "@assets/téléchargement_(77)_1785698869066.png";
import iconSolde from "@assets/téléchargement_(80)_1785698869097.png";
import iconService from "@assets/mine-mod-cs-DtBQ0Sp0_1782689895410.png";
import iconPassword from "@assets/mine-mod-change-pwd-D4tL_Aft_1785698869154.png";
import iconAbout from "@assets/mine-mod-aboutus-xnaBhqOq_1785698869125.png";

/* ── Menu row matching reference screenshot ── */
function MenuRow({
  icon, iconBg, label, onClick, danger,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
      style={{
        background: danger
          ? "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)"
          : "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
        boxShadow: "0 3px 10px rgba(245,158,11,0.3)",
      }}
    >
      {/* Icon badge — dark square with colored icon, matches reference */}
      <span
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: iconBg || "rgba(0,0,0,0.18)" }}
      >
        {icon}
      </span>
      <span
        className="flex-1 text-left font-bold text-sm"
        style={{ color: danger ? "#7f1d1d" : "#3D1A00" }}
      >
        {label}
      </span>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#3D1A00" }} />
    </button>
  );
}

/* ── Quick action card ── */
function ActionCard({
  icon, label, onClick,
}: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl active:scale-[0.97] transition-transform"
      style={{
        background: "linear-gradient(160deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
        boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
      }}
    >
      <span
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.25)" }}
      >
        {icon}
      </span>
      <span className="text-xs font-bold text-center leading-tight" style={{ color: "#3D1A00" }}>
        {label}
      </span>
    </button>
  );
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPinModal, setShowPinModal] = useState(false);
  const [adminPin, setAdminPin] = useState("");

  const verifyPinMutation = useMutation({
    mutationFn: async (pin: string) => {
      const res = await apiRequest("POST", "/api/admin/verify-pin", { pin });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "PIN incorrect"); }
      return res.json();
    },
    onSuccess: () => { setShowPinModal(false); setAdminPin(""); navigate("/admin"); },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const handleLogout = async () => { await logout(); navigate("/login"); };

  if (!user) return null;

  const balance = parseFloat(user.balance || "0");
  const country = getCountryByCode(user.country);
  const currency = country?.currency || "FCFA";
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <div
      className="flex flex-col min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      <div className="overflow-y-auto">

        {/* ── User profile card ── */}
        <div className="px-3 pt-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
          >
            {/* Avatar — platform logo */}
            <div
              className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2"
              style={{ borderColor: "rgba(255,255,255,0.5)" }}
            >
              <img src={allanLogo} alt="ALLAN" className="w-full h-full object-cover" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-black text-lg leading-tight truncate" style={{ color: "#3D1A00" }}>
                {user.phone}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(61,26,0,0.7)" }}>
                Code d'invitation:{" "}
                <span className="font-bold" style={{ color: "#3D1A00" }}>{user.referralCode}</span>
              </p>
            </div>
            {/* Admin badge */}
            {user.isAdmin && (
              <button
                onClick={() =>
                  user.isAdminPasswordRequired === false
                    ? navigate("/admin")
                    : setShowPinModal(true)
                }
                className="px-3 py-1 rounded-lg text-xs font-bold"
                style={{ background: "rgba(0,0,0,0.2)", color: "#3D1A00" }}
              >
                Admin
              </button>
            )}
          </div>
        </div>

        {/* ── Balance card ── */}
        <div className="px-3 mt-3">
          <div
            className="flex items-center gap-3 px-4 py-4 rounded-2xl"
            style={{
              background: "rgba(30,10,80,0.75)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Wallet className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs">Solde({currency})</p>
              <p className="text-white font-black text-2xl">{fmt(balance)}</p>
            </div>
            <button
              onClick={() => navigate("/wallet")}
              className="px-4 py-2 rounded-xl text-sm font-bold border active:scale-95 transition-transform shrink-0"
              style={{ borderColor: "#F59E0B", color: "#F59E0B", background: "rgba(0,0,0,0.2)" }}
            >
              Mon Portefeuille
            </button>
          </div>
        </div>

        {/* ── 3 action cards ── */}
        <div className="px-3 mt-3 flex gap-2">
          <ActionCard
            label="Historique des dépôts"
            onClick={() => navigate("/deposits-history")}
            icon={
              <img src={iconDepot} alt="" className="w-7 h-7 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />
            }
          />
          <ActionCard
            label="Historique des retraits"
            onClick={() => navigate("/withdrawal-history")}
            icon={
              <img src={iconRetrait} alt="" className="w-7 h-7 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />
            }
          />
          <ActionCard
            label="Relevé de solde"
            onClick={() => navigate("/history")}
            icon={
              <img src={iconSolde} alt="" className="w-7 h-7 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />
            }
          />
        </div>

        {/* ── Service section ── */}
        <div className="px-3 mt-5">
          <p className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#F59E0B" }}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
            Service
          </p>

          <div className="space-y-2.5">
            {/* Service client */}
            <MenuRow
              icon={<img src={iconService} alt="" className="w-5 h-5 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />}
              iconBg="#1B4FA0"
              label="Service client"
              onClick={() => navigate("/service")}
            />

            {/* Changer mot de passe */}
            <MenuRow
              icon={<img src={iconPassword} alt="" className="w-5 h-5 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />}
              iconBg="#D97706"
              label="Changer le mot de passe"
              onClick={() => navigate("/change-password")}
            />

            {/* À propos */}
            <MenuRow
              icon={<img src={iconAbout} alt="" className="w-5 h-5 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />}
              iconBg="#1B4FA0"
              label="À propos de nous"
              onClick={() => navigate("/about")}
            />

            {/* Déconnexion — red logout */}
            <MenuRow
              icon={<LogOut className="w-5 h-5 text-white" />}
              iconBg="#DC2626"
              label="Déconnexion"
              onClick={handleLogout}
              danger
            />
          </div>
        </div>
      </div>

      {/* ── Admin PIN Modal ── */}
      {showPinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowPinModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl p-6"
            style={{ background: "#1a0533" }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-center text-lg mb-4">Code PIN Admin</h3>
            <input
              type="password"
              value={adminPin}
              onChange={e => setAdminPin(e.target.value)}
              placeholder="Entrez votre PIN"
              className="w-full rounded-xl px-4 py-3 text-sm text-center outline-none mb-4"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
              onKeyDown={e => e.key === "Enter" && verifyPinMutation.mutate(adminPin)}
            />
            <button
              onClick={() => verifyPinMutation.mutate(adminPin)}
              disabled={verifyPinMutation.isPending}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#F5C518,#D97706)" }}
            >
              {verifyPinMutation.isPending ? "..." : "Confirmer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
