import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Gift } from "lucide-react";

interface WheelRecord {
  id: number;
  userId: number;
  spinsAvailable: number;
  totalSpinsUsed: number;
  user: { fullName: string; phone: string; country: string };
}

export default function AdminWheelSpins() {
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [spins, setSpins] = useState("1");
  const [search, setSearch] = useState("");

  const { data: records = [], isLoading } = useQuery<WheelRecord[]>({
    queryKey: ["/api/admin/wheel/spins"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/wheel/spins");
      return res.json();
    },
  });

  const grantMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/wheel/grant", {
        userId: parseInt(userId),
        spins: parseInt(spins),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Tours accordés !", description: `${spins} tour(s) accordé(s) à l'utilisateur #${userId}` });
      setUserId("");
      setSpins("1");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wheel/spins"] });
    },
    onError: (e: Error) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const filtered = records.filter(r =>
    !search ||
    r.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.user.phone.includes(search) ||
    String(r.userId).includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Grant form */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-600" />
          Accorder des tours gratuits
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">ID Utilisateur</label>
            <Input
              placeholder="ex: 42"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              type="number"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nombre de tours</label>
            <Input
              placeholder="ex: 3"
              value={spins}
              onChange={e => setSpins(e.target.value)}
              type="number"
              min="1"
            />
          </div>
        </div>
        <Button
          onClick={() => grantMutation.mutate()}
          disabled={!userId || !spins || grantMutation.isPending}
          className="w-full"
          style={{ background: "#2563eb" }}
        >
          {grantMutation.isPending
            ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Enregistrement…</>
            : "Accorder les tours"}
        </Button>
      </div>

      {/* Records list */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Soldes de tours ({records.length})
          </h3>
          <Input
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-40 text-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Aucun enregistrement</p>
        ) : (
          <div className="space-y-2">
            {filtered.map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">#{r.userId} — {r.user.fullName}</p>
                  <p className="text-gray-400 text-xs">{r.user.phone} · {r.user.country}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-sm">{r.spinsAvailable} disponible(s)</p>
                  <p className="text-gray-400 text-xs">{r.totalSpinsUsed} utilisé(s)</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
