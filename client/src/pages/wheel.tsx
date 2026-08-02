import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getCountryByCode } from "@/lib/countries";
import { ChevronLeft, Loader2, Trophy, Star, Frown, Target, Users } from "lucide-react";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import allanLogo from "@assets/allan_logo.jpg";

// ─── Wheel segments ───────────────────────────────────────────────────────────
const NORMAL_SEGMENTS = [50, 100, 0, 200, 300, 500, 750, 1000];
const VIP_SEGMENTS    = [100, 300, 0, 750, 1000, 1500, 2000, 3000];

// Gold / purple ALLAN palette for wheel slices
const SEGMENT_COLORS = [
  "#F5C518", "#D97706", "#7B2FBE", "#F59E0B",
  "#5B1A9B", "#E88C00", "#4A1580", "#FBBF24",
];

interface WheelStatus {
  spinsAvailable: number;
  totalSpinsUsed: number;
  history: { prizeAmount: number; isVip: boolean; createdAt: string }[];
}

interface SpinResult {
  prizeAmount: number;
  newBalance: number;
  isVip: boolean;
}

function drawWheel(canvas: HTMLCanvasElement, segments: number[], rotation: number) {
  const ctx = canvas.getContext("2d")!;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = cx - 8;
  const n = segments.length;
  const arc = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Outer glow ring
  ctx.save();
  ctx.shadowColor = "rgba(245,197,24,0.5)";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(245,197,24,0.15)";
  ctx.fill();
  ctx.restore();

  for (let i = 0; i < n; i++) {
    const start = rotation + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${segments[i] === 0 ? "14" : "13"}px system-ui, sans-serif`;
    ctx.fillText(segments[i] === 0 ? "Perdu" : `${segments[i]} FCFA`, r - 12, 5);
    ctx.restore();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(245,197,24,0.6)";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
}

export default function WheelPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<SpinResult | null>(null);
  const rotationRef = useRef(0);

  const { data: status, isLoading } = useQuery<WheelStatus>({
    queryKey: ["/api/wheel/status"],
    refetchOnWindowFocus: false,
  });

  const segments = prize?.isVip ? VIP_SEGMENTS : NORMAL_SEGMENTS;

  useEffect(() => {
    if (!canvasRef.current) return;
    drawWheel(canvasRef.current, segments, rotationRef.current);
  });

  const spinMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/wheel/spin", {});
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Erreur");
      }
      return res.json() as Promise<SpinResult>;
    },
    onSuccess: (result) => {
      const segs = result.isVip ? VIP_SEGMENTS : NORMAL_SEGMENTS;
      const n = segs.length;
      const arc = (2 * Math.PI) / n;
      const winIdx = segs.indexOf(result.prizeAmount);
      const targetAngle = -Math.PI / 2 - (winIdx + 0.5) * arc;
      const fullSpins = 6 * 2 * Math.PI;
      const finalRotation = rotationRef.current + fullSpins + (targetAngle - (rotationRef.current % (2 * Math.PI)));
      const duration = 4000;
      const start = performance.now();
      const startRot = rotationRef.current;

      function easeOut(t: number) { return 1 - Math.pow(1 - t, 4); }
      function frame(now: number) {
        const t = Math.min((now - start) / duration, 1);
        rotationRef.current = startRot + (finalRotation - startRot) * easeOut(t);
        if (canvasRef.current) drawWheel(canvasRef.current, segs, rotationRef.current);
        if (t < 1) {
          animRef.current = requestAnimationFrame(frame);
        } else {
          setSpinning(false);
          setPrize(result);
          queryClient.invalidateQueries({ queryKey: ["/api/wheel/status"] });
          queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        }
      }
      animRef.current = requestAnimationFrame(frame);
    },
    onError: (err: Error) => {
      setSpinning(false);
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const handleSpin = () => {
    if (spinning || !status || status.spinsAvailable < 1) return;
    setPrize(null);
    setSpinning(true);
    spinMutation.mutate();
  };

  if (!user) return null;
  const country = getCountryByCode(user.country);
  const currency = country?.currency || "FCFA";

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      <div className="flex-1 overflow-y-auto pb-24">

        {/* ── Header ── */}
        <div className="relative flex items-center px-4 py-4">
          <Link href="/account">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <h1 className="flex-1 text-center text-white font-bold text-lg">Roue de Chance</h1>
          <div className="w-9" />
        </div>

        {/* ── Spins badge ── */}
        <div className="flex justify-center mt-2">
          <div
            className="flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
          >
            <Star className="w-4 h-4 fill-current" style={{ color: "#3D1A00" }} />
            <span className="font-bold text-sm" style={{ color: "#3D1A00" }}>
              {isLoading ? "…" : status?.spinsAvailable ?? 0} tour(s) disponible(s)
            </span>
          </div>
        </div>

        {/* ── Wheel ── */}
        <div className="flex flex-col items-center mt-6 px-4">
          <div className="relative">
            {/* Pointer triangle — gold */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10"
              style={{
                top: -14, width: 0, height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "24px solid #F5C518",
                filter: "drop-shadow(0 2px 4px rgba(245,197,24,0.7))",
              }}
            />
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full"
              style={{ boxShadow: "0 0 40px rgba(245,197,24,0.3), 0 8px 32px rgba(0,0,0,0.5)" }}
            />
            {/* Center logo */}
            <div
              className="absolute rounded-full overflow-hidden bg-white"
              style={{
                width: 52, height: 52,
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                boxShadow: "0 0 12px rgba(245,197,24,0.5)",
              }}
            >
              <img src={allanLogo} alt="ALLAN" className="w-full h-full object-contain p-1" />
            </div>
          </div>

          {/* ── Prize display ── */}
          {prize && (
            prize.prizeAmount === 0 ? (
              <div
                className="mt-5 rounded-2xl px-6 py-4 text-center w-full max-w-xs"
                style={{
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.4)",
                }}
              >
                <Frown className="w-8 h-8 mx-auto mb-1" style={{ color: "#FCA5A5" }} />
                <p className="font-bold text-lg" style={{ color: "#FCA5A5" }}>Dommage !</p>
                <p className="text-white/50 text-sm mt-1">Pas de chance cette fois. Réessayez !</p>
              </div>
            ) : (
              <div
                className="mt-5 rounded-2xl px-6 py-4 text-center w-full max-w-xs"
                style={{
                  background: "rgba(20,5,60,0.8)",
                  border: "1px solid rgba(245,197,24,0.4)",
                  boxShadow: "0 0 20px rgba(245,197,24,0.2)",
                }}
              >
                <Trophy className="w-8 h-8 mx-auto mb-1" style={{ color: "#F59E0B" }} />
                <p className="text-white/60 text-sm">Félicitations !</p>
                <p className="font-extrabold text-3xl mt-1" style={{ color: "#F5C518" }}>
                  +{prize.prizeAmount} <span className="text-xl">{currency}</span>
                </p>
                {prize.isVip && (
                  <span
                    className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(245,197,24,0.2)", color: "#F59E0B" }}
                  >
                    ⭐ Récompense VIP
                  </span>
                )}
              </div>
            )
          )}

          {/* ── Spin button ── */}
          <button
            onClick={handleSpin}
            disabled={spinning || !status || status.spinsAvailable < 1}
            className="mt-5 w-full max-w-xs py-4 rounded-full font-bold text-lg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: spinning || !status || status.spinsAvailable < 1
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
              color: spinning || !status || status.spinsAvailable < 1 ? "rgba(255,255,255,0.3)" : "#3D1A00",
              boxShadow: status?.spinsAvailable ? "0 6px 20px rgba(245,158,11,0.5)" : "none",
            }}
          >
            {spinning ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Rotation…
              </span>
            ) : status?.spinsAvailable === 0 ? (
              "Aucun tour disponible"
            ) : (
              "Tourner la roue !"
            )}
          </button>

          {/* ── Rules card ── */}
          <div
            className="mt-6 rounded-2xl px-5 py-4 w-full max-w-xs space-y-2"
            style={{
              background: "rgba(20,5,60,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="font-bold text-white text-sm mb-2">Comment obtenir des tours ?</p>
            <p className="text-white/60 text-xs flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              Achetez un produit → 1 tour gratuit
            </p>
            <p className="text-white/60 text-xs flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              Chaque filleul qui achète un produit → 1 tour gratuit
            </p>
          </div>

          {/* ── History ── */}
          {status && status.history.length > 0 && (
            <div
              className="mt-4 rounded-2xl px-5 py-4 w-full max-w-xs"
              style={{
                background: "rgba(20,5,60,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="font-bold text-white text-sm mb-3">Derniers gains</p>
              {status.history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: i < status.history.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
                >
                  <span className="text-white/40 text-xs">
                    {new Date(h.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </span>
                  {h.prizeAmount === 0 ? (
                    <span className="font-bold text-red-400 text-sm">Perdu</span>
                  ) : (
                    <span className="font-bold text-sm" style={{ color: "#F59E0B" }}>
                      +{h.prizeAmount} {currency}
                    </span>
                  )}
                  {h.isVip && h.prizeAmount > 0 && (
                    <span className="text-xs" style={{ color: "#F59E0B" }}>VIP</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
