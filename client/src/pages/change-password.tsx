import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useLocation } from "wouter";

function Field({
  label, value, show, onToggle, onChange, placeholder, testId,
}: {
  label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void;
  placeholder?: string; testId: string;
}) {
  return (
    <div>
      <label className="block text-gray-800 text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || label}
          className="w-full rounded-2xl px-4 py-4 pr-12 text-sm outline-none"
          style={{ background: "#F2F4F8", color: "#111" }}
          data-testid={testId}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          onClick={onToggle}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!current || !newPwd || !confirm) throw new Error("Veuillez remplir tous les champs");
      if (newPwd.length < 6) throw new Error("Minimum 6 caractères");
      if (newPwd !== confirm) throw new Error("Les mots de passe ne correspondent pas");
      const res = await apiRequest("POST", "/api/change-password", { currentPassword: current, newPassword: newPwd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Mot de passe modifié !" });
      setCurrent(""); setNewPwd(""); setConfirm("");
      navigate("/account");
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="flex flex-col min-h-full bg-white pb-28">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate("/account")} className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Changer le mot de passe</h1>
      </div>

      {/* Lock icon */}
      <div className="flex justify-center pt-8 pb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#F5C518,#D97706)", boxShadow: "0 6px 20px rgba(245,158,11,0.4)" }}
        >
          <KeyRound className="w-12 h-12 text-amber-500" />
        </div>
      </div>

      <div className="px-5 space-y-5 flex-1">
        <Field
          label="Mot de passe actuel"
          value={current}
          show={showCurrent}
          onToggle={() => setShowCurrent(v => !v)}
          onChange={setCurrent}
          placeholder="Entrez le mot de passe actuel"
          testId="input-current-password"
        />
        <Field
          label="Nouveau mot de passe"
          value={newPwd}
          show={showNew}
          onToggle={() => setShowNew(v => !v)}
          onChange={setNewPwd}
          placeholder="Entrez le nouveau mot de passe"
          testId="input-new-password"
        />
        <Field
          label="Confirmer le mot de passe"
          value={confirm}
          show={showConfirm}
          onToggle={() => setShowConfirm(v => !v)}
          onChange={setConfirm}
          placeholder="Confirmez le nouveau mot de passe"
          testId="input-confirm-password"
        />

        <p className="text-xs text-gray-400 text-center">Minimum 6 caractères requis</p>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full py-4 rounded-full font-black text-sm tracking-wider active:scale-[0.98] transition-transform"
          style={{
            background: mutation.isPending ? "#ccc" : "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
            color: "#3D1A00",
            boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
          }}
          data-testid="button-change-password-submit"
        >
          {mutation.isPending ? "EN COURS..." : "CONFIRMER"}
        </button>
      </div>
    </div>
  );
}
