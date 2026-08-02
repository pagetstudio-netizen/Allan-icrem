import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import emptyImg from "@assets/waiting_(1)_1785698979439.svg";
import { useState } from "react";

function maskPhone(p: string) {
  if (!p) return "****";
  const c = p.replace(/\s/g, "");
  if (c.length <= 6) return c;
  return c.slice(0, 5) + "****" + c.slice(-3);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR");
}

function fmtAmt(n: string | number) {
  return Number(n).toLocaleString("fr-FR");
}

export default function AdminReviews() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [previewImgs, setPreviewImgs] = useState<string[] | null>(null);

  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/reviews"],
  });

  const approve = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/admin/reviews/${id}/approve`, {});
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Approuvé", description: "+50 FCFA crédité à l'utilisateur" });
      qc.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const reject = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/admin/reviews/${id}/reject`, {});
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "❌ Rejeté" });
      qc.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const pending = reviews.filter(r => r.status === "pending");
  const approved = reviews.filter(r => r.status === "approved");
  const rejected = reviews.filter(r => r.status === "rejected");

  return (
    <div className="p-4 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "En attente", count: pending.length, color: "#F59E0B" },
          { label: "Approuvés", count: approved.length, color: "#10b981" },
          { label: "Rejetés", count: rejected.length, color: "#EF4444" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <img src={emptyImg} alt="vide" className="w-32 h-32 mb-2 opacity-70" />
          <p>Aucun avis soumis</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => {
            const imgs: string[] = (() => { try { return JSON.parse(r.images); } catch { return []; } })();
            return (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">{maskPhone(r.whatsapp)}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: r.status === "approved" ? "#D1FAE5" : r.status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                          color: r.status === "approved" ? "#059669" : r.status === "rejected" ? "#DC2626" : "#D97706",
                        }}>
                        {r.status === "approved" ? "✓ Approuvé" : r.status === "rejected" ? "✗ Rejeté" : "⏳ En attente"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(r.createdAt)} — {r.email || "—"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Montant : <span className="font-semibold" style={{ color: "#E91E8C" }}>+{fmtAmt(r.amount)} FCFA</span></p>
                    <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                  </div>

                  {/* Thumbnail */}
                  {imgs[0] && (
                    <button onClick={() => setPreviewImgs(imgs)} className="shrink-0">
                      <div className="w-16 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Action buttons for pending */}
                {r.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => approve.mutate(r.id)}
                      disabled={approve.isPending}
                      className="flex-1 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1"
                      style={{ background: "#10b981" }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approuver (+50 FCFA)
                    </button>
                    <button
                      onClick={() => reject.mutate(r.id)}
                      disabled={reject.isPending}
                      className="flex-1 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1"
                      style={{ background: "#EF4444" }}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Rejeter
                    </button>
                    {imgs.length > 0 && (
                      <button
                        onClick={() => setPreviewImgs(imgs)}
                        className="px-3 py-2 rounded-xl text-gray-600 text-xs font-bold flex items-center gap-1"
                        style={{ background: "#F3F4F6" }}
                      >
                        <Eye className="w-3.5 h-3.5" /> Voir
                      </button>
                    )}
                  </div>
                )}

                {/* Bonus info */}
                {r.status === "approved" && (
                  <p className="text-xs mt-2" style={{ color: r.bonusPaid ? "#10b981" : "#F59E0B" }}>
                    {r.bonusPaid ? "✓ Bonus 50 FCFA crédité" : "⏳ Bonus non encore versé"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Image lightbox */}
      {previewImgs && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setPreviewImgs(null)}
        >
          {previewImgs.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="max-h-64 max-w-full rounded-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
          ))}
          <button className="mt-2 text-white text-sm">Fermer ✕</button>
        </div>
      )}
    </div>
  );
}
