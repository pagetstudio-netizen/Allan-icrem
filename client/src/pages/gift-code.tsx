import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2, Gift, Tag, Users, Send } from "lucide-react";
import { SiTelegram, SiWhatsapp, SiFacebook } from "react-icons/si";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SettingsLinks {
  groupLink: string;
  groupType: string;
  groupLabel: string;
}

function GroupIcon({ type, className }: { type: string; className?: string }) {
  if (type === "whatsapp") return <SiWhatsapp className={className} />;
  if (type === "facebook") return <SiFacebook className={className} />;
  return <SiTelegram className={className} />;
}

function groupBg(type: string) {
  if (type === "whatsapp") return "linear-gradient(135deg,#25D366,#128C7E)";
  if (type === "facebook") return "linear-gradient(135deg,#1877F2,#0d5db9)";
  return "linear-gradient(135deg,#229ED9,#1a7fb5)";
}

export default function GiftCodePage() {
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [code, setCode] = useState("");

  const { data: links } = useQuery<SettingsLinks>({
    queryKey: ["/api/settings/links"],
    select: (d: any) => ({
      groupLink: d.groupLink || "https://t.me/allaninvest",
      groupType: d.groupType || "telegram",
      groupLabel: d.groupLabel || "Groupe de discussion",
    }),
  });

  const claimMutation = useMutation({
    mutationFn: async (giftCode: string) => {
      const response = await apiRequest("POST", "/api/gift-codes/claim", { code: giftCode });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: (data) => {
      refreshUser();
      setCode("");
      toast({ title: "Félicitations !", description: data.message });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!code.trim()) {
      toast({ title: "Erreur", description: "Veuillez saisir un code", variant: "destructive" });
      return;
    }
    claimMutation.mutate(code.trim());
  };

  const groupType = links?.groupType || "telegram";
  const groupLink = links?.groupLink || "https://t.me/allaninvest";
  const groupLabel = links?.groupLabel || "Groupe de discussion";

  return (
    <div className="flex flex-col min-h-full bg-gray-50">

      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-black">
        <button
          onClick={() => navigate("/account")}
          className="p-1.5 rounded-full bg-white/10 text-white mr-3"
          data-testid="button-back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-white font-bold text-base pr-10">
          Code Cadeau
        </h1>
      </header>

      {/* Hero gift icon */}
      <div className="flex flex-col items-center pt-8 pb-4 bg-black">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-3">
          <Gift className="w-10 h-10 text-yellow-400" />
        </div>
        <p className="text-white font-extrabold text-xl">Code Bonus</p>
        <p className="text-white/60 text-xs mt-1">Entrez votre code pour recevoir votre récompense</p>
      </div>

      <div className="flex-1 px-4 pt-5 pb-24 space-y-4">

        {/* Input card */}
        <div className="bg-white rounded-3xl shadow-sm px-5 py-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Tag className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-gray-800 font-bold text-sm">Saisir le code cadeau</span>
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="EX: ALLAN2025ABC"
            className="w-full px-4 py-3.5 rounded-2xl border-2 text-center text-sm font-mono tracking-widest outline-none transition-colors bg-gray-50"
            style={{ borderColor: code ? "#111111" : "#e5e7eb" }}
            data-testid="input-gift-code"
          />

          <button
            onClick={handleSubmit}
            disabled={claimMutation.isPending}
            className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 bg-black disabled:opacity-50"
            data-testid="button-submit-code"
          >
            {claimMutation.isPending
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <><Gift className="w-4 h-4" /> Recevoir ma récompense</>}
          </button>
        </div>

        {/* Join group CTA */}
        <div className="bg-white rounded-3xl shadow-sm px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-gray-800 font-bold text-sm">Où obtenir des codes ?</p>
          </div>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Les codes bonus sont publiés chaque jour dans notre groupe officiel. Rejoignez-le pour ne rien manquer.
          </p>
          <a
            href={groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-white font-bold text-sm"
            style={{ background: groupBg(groupType) }}
            data-testid="button-join-group"
          >
            <GroupIcon type={groupType} className="w-5 h-5" />
            Rejoindre — {groupLabel}
          </a>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl shadow-sm px-5 py-5">
          <p className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
            <Send className="w-4 h-4" /> Comment ça marche ?
          </p>
          <div className="space-y-3">
            {[
              "Rejoignez le groupe officiel en cliquant sur le bouton ci-dessus",
              "Suivez les annonces — les codes sont publiés chaque soir",
              "Copiez le code et collez-le ici avant expiration",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
