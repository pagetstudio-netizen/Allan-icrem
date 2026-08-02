import { useState, useRef } from "react";
import { Gift, Upload } from "lucide-react";
import emptyImg from "@assets/waiting_(1)_1785698979439.svg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { getCountryByCode } from "@/lib/countries";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

/* ── helpers ── */
function maskPhone(phone: string): string {
  if (!phone) return "****";
  const clean = phone.replace(/\s/g, "");
  if (clean.length <= 6) return clean;
  const keep = 3;
  return clean.slice(0, keep + 2) + "****" + clean.slice(-keep);
}

function fmtDate(d: string) {
  return new Date(d)
    .toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\//g, "-");
}

function fmtAmount(n: string | number) {
  return Number(n).toLocaleString("fr-FR");
}

/* ─────────────────── Submit Form ─────────────────── */
function SubmitForm({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const country = getCountryByCode(user?.country || "");
  const currency = country?.currency || "XOF";
  const { toast } = useToast();
  const qc = useQueryClient();

  const [whatsapp, setWhatsapp] = useState(user?.phone || "");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleImage = (idx: number, file: File | null) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Fichier trop grand", description: "Max 8 Mo", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      setImages(prev => { const next = [...prev]; next[idx] = b64; return next; });
    };
    reader.readAsDataURL(file);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const validImages = images.filter(Boolean);
      if (validImages.length < 1) throw new Error("Ajoutez au moins 1 image");
      const res = await apiRequest("POST", "/api/reviews", { whatsapp, email, comment, images: validImages });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Soumis !", description: "Votre avis est en attente de validation. +50 FCFA après validation." });
      qc.invalidateQueries({ queryKey: ["/api/reviews"] });
      onBack();
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const inputStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    borderRadius: 12,
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center px-4 py-4"
        style={{ background: "rgba(20,5,60,0.6)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button onClick={onBack} className="mr-4 text-white text-xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-white text-base font-bold pr-6">Retour D'information</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-4 space-y-4">
        {/* WhatsApp */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="Entrez le numéro WhatsApp"
            className="w-full px-4 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Entrez l'e-mail"
            className="w-full px-4 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">Description</label>
          <div className="rounded-xl overflow-hidden" style={{ ...inputStyle, padding: 0 }}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value.slice(0, 200))}
              placeholder="Entrez une description"
              rows={5}
              className="w-full px-4 py-3 text-sm outline-none resize-none bg-transparent"
              style={{ color: "#fff" }}
            />
            <div className="text-right px-4 pb-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {comment.length} / 200
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Image <span className="font-normal text-white/40">(minimum 2)</span>
          </label>
          <div className="flex gap-3 flex-wrap">
            {[0, 1].map(idx => (
              <div key={idx}>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRefs[idx]}
                  className="hidden"
                  onChange={e => handleImage(idx, e.target.files?.[0] || null)}
                />
                <button
                  onClick={() => inputRefs[idx].current?.click()}
                  className="rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    width: 80, height: 80,
                    background: images[idx] ? "transparent" : "rgba(255,255,255,0.08)",
                    border: images[idx] ? "2px solid #F59E0B" : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {images[idx] ? (
                    <img src={images[idx]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-light" style={{ color: "rgba(255,255,255,0.3)" }}>+</span>
                  )}
                </button>
              </div>
            ))}
            {/* extra slot */}
            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file"; input.accept = "image/*";
                input.onchange = (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setImages(prev => [...prev, ev.target?.result as string]);
                    reader.readAsDataURL(f);
                  }
                };
                input.click();
              }}
              className="rounded-xl flex items-center justify-center"
              style={{
                width: 80, height: 80,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span className="text-3xl font-light" style={{ color: "rgba(255,255,255,0.2)" }}>+</span>
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>Ajoutez vos captures de retrait</p>
        </div>

        <p className="text-xs text-center" style={{ color: "#F59E0B" }}>
          <Gift className="w-3.5 h-3.5 inline mr-1" />
          +50 FCFA de bonus après validation par l'administrateur
        </p>
      </div>

      {/* Submit */}
      <div
        className="px-5 pb-8 pt-3"
        style={{ background: "rgba(20,5,60,0.8)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full py-4 rounded-full font-black text-sm tracking-wider active:scale-[0.98] transition-transform"
          style={{
            background: mutation.isPending
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
            color: mutation.isPending ? "rgba(255,255,255,0.3)" : "#3D1A00",
            boxShadow: mutation.isPending ? "none" : "0 4px 15px rgba(245,158,11,0.4)",
          }}
        >
          {mutation.isPending ? "EN COURS..." : "SOUMETTRE"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── Review Card ─────────────────── */
function ReviewCard({ review }: { review: any }) {
  const imgs: string[] = (() => {
    try { return JSON.parse(review.images); } catch { return []; }
  })();
  const currency = review.user?.country === "NE" ? "XOF" : "XAF";

  return (
    <div
      className="flex items-start gap-3 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">
          {maskPhone(review.whatsapp || review.user?.phone || "")}
          <span className="font-black ml-1" style={{ color: "#F59E0B" }}>
            +{fmtAmount(review.amount)}{currency}
          </span>
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{fmtDate(review.createdAt)}</p>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{review.comment}</p>
      </div>
      {imgs[0] && (
        <div className="shrink-0 rounded-xl overflow-hidden" style={{ width: 72, height: 90 }}>
          <img src={imgs[0]} alt="preuve" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Actualités ─────────────────── */
function Actualites() {
  const news = [
    { id: 1, title: "ALLAN Construction — Plateforme officielle 2026", body: "Bienvenue sur la nouvelle plateforme d'investissement ALLAN Construction. Investissez dès aujourd'hui et bâtissez votre avenir.", date: "2026-07-01" },
    { id: 2, title: "Bonus de parrainage augmenté", body: "Le bonus de parrainage est maintenant disponible. Invitez vos amis et gagnez des commissions sur leurs investissements.", date: "2026-07-10" },
    { id: 3, title: "Nouveau VIP 9 disponible", body: "Le niveau VIP 9 est maintenant disponible. Investissez 800 000 FCFA pour un revenu quotidien de 130 000 FCFA.", date: "2026-07-20" },
  ];

  return (
    <div className="px-4 py-2">
      {news.map((n, i) => (
        <div
          key={n.id}
          className="py-4"
          style={{ borderBottom: i < news.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
        >
          <p className="text-sm font-bold text-white">{n.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{n.date}</p>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{n.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────── Main Page ─────────────────── */
export default function AvisPage() {
  const [tab, setTab] = useState<"preuves" | "actualites">("preuves");
  const [showForm, setShowForm] = useState(false);

  const { data: reviewsList = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/reviews"],
  });

  if (showForm) return <SubmitForm onBack={() => setShowForm(false)} />;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#4A1580 100%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-center px-4 py-4"
        style={{ background: "rgba(20,5,60,0.6)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h1 className="text-white text-lg font-bold">Avis</h1>
      </div>

      {/* Tabs */}
      <div
        className="flex"
        style={{ background: "rgba(20,5,60,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {(["preuves", "actualites"] as const).map((t) => {
          const label = t === "preuves" ? "Preuves de retrait" : "Actualités";
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-semibold relative"
              style={{ color: isActive ? "#F59E0B" : "rgba(255,255,255,0.4)" }}
            >
              {label}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: 3, background: "#F59E0B", borderRadius: "3px 3px 0 0" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {tab === "preuves" ? (
          <div>
            {/* Upload button */}
            <div className="px-4 pt-4 pb-3">
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-full font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                style={{
                  background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
                  color: "#3D1A00",
                  boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
                }}
              >
                <Upload className="w-4 h-4" />
                Télécharger Une Preuve
              </button>
            </div>

            {/* List */}
            <div className="px-4">
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)", width: "75%" }} />
                        <div className="h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)", width: "40%" }} />
                        <div className="h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)", width: "100%" }} />
                      </div>
                      <div className="w-16 h-20 rounded-xl animate-pulse shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
                    </div>
                  ))}
                </div>
              ) : reviewsList.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <img src={emptyImg} alt="vide" className="w-36 h-36 mb-4 opacity-60" />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Aucune preuve de retrait pour l'instant.</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Soyez le premier à partager votre expérience !</p>
                </div>
              ) : (
                reviewsList.map((r: any) => <ReviewCard key={r.id} review={r} />)
              )}
            </div>
          </div>
        ) : (
          <Actualites />
        )}
      </div>
    </div>
  );
}
