import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getCountryByCode } from "@/lib/countries";
import { useState } from "react";
import { Gift, Users } from "lucide-react";

interface TeamStats {
  level1Count: number;
  level2Count: number;
  level3Count: number;
  totalCommission: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
}

const fmt = (n: number) => n.toLocaleString("fr-FR");

function CopyBtn({ text }: { text: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copié !" });
  };
  return (
    <button
      onClick={copy}
      className="px-4 py-1.5 rounded-full text-xs font-bold border active:scale-95 transition-transform shrink-0"
      style={{
        background: copied ? "#F59E0B" : "transparent",
        borderColor: "#D97706",
        color: copied ? "#fff" : "#D97706",
        minWidth: 68,
      }}
    >
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

function ShareBtn({
  icon, label, onClick,
}: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
      style={{
        background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
        boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
        color: "#3D1A00",
      }}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function TeamPage() {
  const { user } = useAuth();
  const { data: stats } = useQuery<TeamStats>({ queryKey: ["/api/team/stats"] });
  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  if (!user) return null;

  const countryInfo = getCountryByCode(user.country);
  const currency = countryInfo?.currency || "XOF";
  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const lv1Pct = settings?.level1Commission || "15";
  const lv2Pct = settings?.level2Commission || "2";
  const lv3Pct = settings?.level3Commission || "1";

  const totalPeople =
    (stats?.level1Count || 0) + (stats?.level2Count || 0) + (stats?.level3Count || 0);
  const totalRewards = stats?.totalCommission || 0;

  const shareMsg = encodeURIComponent(
    `🌟 Rejoignez ALLAN Construction et gagnez des revenus quotidiens !\n\n🎯 Code invitation : ${user.referralCode}\n🔗 ${referralLink}\n\n💰 Bonus garanti dès l'inscription !`
  );
  const shareUrl = encodeURIComponent(referralLink);

  const onWhatsApp = () => window.open(`https://wa.me/?text=${shareMsg}`, "_blank");
  const onTelegram = () => window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareMsg}`, "_blank");
  const onFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank");
  const onTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${shareMsg}`, "_blank");

  const levels = [
    { label: `Niveau 1 (${lv1Pct}%)`, count: stats?.level1Count || 0, commission: stats?.level1Commission || 0 },
    { label: `Niveau 2 (${lv2Pct}%)`, count: stats?.level2Count || 0, commission: stats?.level2Commission || 0 },
    { label: `Niveau 3 (${lv3Pct}%)`, count: stats?.level3Count || 0, commission: stats?.level3Commission || 0 },
  ];

  return (
    <div
      className="flex flex-col min-h-screen pb-28 overflow-y-auto"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      <div className="px-3 pt-4 space-y-3">

        {/* ── Header stats card ── */}
        <div
          className="rounded-2xl px-4 py-4 flex items-stretch"
          style={{
            background: "rgba(20,5,60,0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex-1">
            <p className="text-white/60 text-xs leading-snug">
              Nombre total de<br />références
            </p>
            <p className="text-white font-black text-2xl mt-1">{totalPeople}</p>
          </div>
          <div
            className="self-stretch mx-3"
            style={{ width: 1, background: "rgba(255,255,255,0.15)" }}
          />
          <div className="flex-1">
            <p className="text-white/60 text-xs leading-snug">
              Revenu total de<br />référencement
            </p>
            <p className="font-black text-2xl mt-1" style={{ color: "#F59E0B" }}>
              {fmt(totalRewards)}{currency}
            </p>
          </div>
        </div>

        {/* ── Invitation card ── */}
        <div
          className="rounded-2xl px-4 py-4"
          style={{
            background: "linear-gradient(135deg,#FFF8E7,#FFF3D0)",
            border: "1px solid #F5C518",
          }}
        >
          {/* Code row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Code d'invitation: </span>
              <span className="font-black text-gray-900 text-sm">{user.referralCode}</span>
            </div>
            <CopyBtn text={user.referralCode} />
          </div>

          {/* Dashed separator */}
          <div style={{ borderBottom: "1.5px dashed #D97706", margin: "10px 0" }} />

          {/* Link row */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Lien d'invitation:</p>
            <div className="flex items-start justify-between gap-2">
              <a
                href={referralLink}
                className="text-xs break-all flex-1"
                style={{ color: "#1B4FA0" }}
                onClick={e => e.preventDefault()}
              >
                {referralLink}
              </a>
              <div className="shrink-0 mt-0.5">
                <CopyBtn text={referralLink} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Partager via ── */}
        <div>
          <p className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4" /> Partager via
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ShareBtn
              label="Whatsapp"
              onClick={onWhatsApp}
              icon={
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#25D366" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
              }
            />
            <ShareBtn
              label="Telegram"
              onClick={onTelegram}
              icon={
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0088CC" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </span>
              }
            />
            <ShareBtn
              label="Facebook"
              onClick={onFacebook}
              icon={
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1877F2" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </span>
              }
            />
            <ShareBtn
              label="Twitter"
              onClick={onTwitter}
              icon={
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#000" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.857L1.785 2.25H8.28l4.259 5.63 5.705-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </span>
              }
            />
          </div>
        </div>

        {/* ── Membres de l'équipe ── */}
        <div
          className="rounded-2xl px-4 py-4"
          style={{
            background: "rgba(20,5,60,0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Membres de l'équipe
          </p>
          {levels.map((l, i) => (
            <div
              key={l.label}
              className="flex items-center justify-between py-2.5"
              style={{
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <span className="text-white/80 text-sm font-semibold w-28">{l.label}</span>
              <span className="text-white/50 text-sm flex-1 text-center">
                {l.count} membres
              </span>
              <span className="font-bold text-sm" style={{ color: "#F59E0B" }}>
                +{fmt(l.commission)} {currency}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
