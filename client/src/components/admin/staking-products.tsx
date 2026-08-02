import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Loader2, Plus, Trash2, Calendar, Clock } from "lucide-react";
import emptyImg from "@assets/waiting_(1)_1785698979439.svg";
import type { StakingProduct } from "@shared/schema";

const stakingSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  price: z.string().min(1, "Prix requis"),
  returnAmount: z.string().min(1, "Montant de retour requis"),
  lockDays: z.string().min(1, "Durée requise"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  launchDate: z.string().optional(), // ISO datetime-local string
  isActive: z.boolean().default(true),
});

type StakingForm = z.infer<typeof stakingSchema>;

function formatLaunchDate(d: Date | string | null | undefined) {
  if (!d) return null;
  const dt = new Date(d);
  return dt.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function isScheduled(product: StakingProduct) {
  if (!product.launchDate) return false;
  return new Date(product.launchDate) > new Date();
}

function toLaunchInputValue(d: Date | string | null | undefined) {
  if (!d) return "";
  const dt = new Date(d);
  // datetime-local requires YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export default function AdminStakingProducts() {
  const { toast } = useToast();
  const [editProduct, setEditProduct] = useState<StakingProduct | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: products, isLoading } = useQuery<StakingProduct[]>({
    queryKey: ["/api/admin/staking/products"],
  });

  const createForm = useForm<StakingForm>({
    resolver: zodResolver(stakingSchema),
    defaultValues: { name: "", price: "", returnAmount: "", lockDays: "30", description: "", imageUrl: "", launchDate: "", isActive: true },
  });

  const editForm = useForm<StakingForm>({
    resolver: zodResolver(stakingSchema),
    defaultValues: { name: "", price: "", returnAmount: "", lockDays: "30", description: "", imageUrl: "", launchDate: "", isActive: true },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/staking/products"] });
    queryClient.invalidateQueries({ queryKey: ["/api/staking/products"] });
  };

  const createMutation = useMutation({
    mutationFn: async (data: StakingForm) => {
      const body = {
        name: data.name,
        description: data.description || null,
        price: parseInt(data.price),
        returnAmount: parseInt(data.returnAmount),
        lockDays: parseInt(data.lockDays),
        launchDate: data.launchDate ? new Date(data.launchDate).toISOString() : null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive,
      };
      const res = await apiRequest("POST", "/api/admin/staking/products", body);
      if (!res.ok) { const r = await res.json(); throw new Error(r.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Produit créé !" }); setShowCreate(false); createForm.reset(); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: StakingForm }) => {
      const body = {
        name: data.name,
        description: data.description || null,
        price: parseInt(data.price),
        returnAmount: parseInt(data.returnAmount),
        lockDays: parseInt(data.lockDays),
        launchDate: data.launchDate ? new Date(data.launchDate).toISOString() : null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive,
      };
      const res = await apiRequest("PUT", `/api/admin/staking/products/${id}`, body);
      if (!res.ok) { const r = await res.json(); throw new Error(r.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Produit mis à jour !" }); setEditProduct(null); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/staking/products/${id}`, { isActive });
      if (!res.ok) { const r = await res.json(); throw new Error(r.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => invalidate(),
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/staking/products/${id}`, {});
      if (!res.ok) { const r = await res.json(); throw new Error(r.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Produit supprimé" }); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const openEdit = (p: StakingProduct) => {
    setEditProduct(p);
    editForm.reset({
      name: p.name,
      price: p.price.toString(),
      returnAmount: p.returnAmount.toString(),
      lockDays: p.lockDays.toString(),
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      launchDate: toLaunchInputValue(p.launchDate),
      isActive: p.isActive,
    });
  };

  const StakingFormFields = ({ form, isPending, onSubmit }: { form: any; isPending: boolean; onSubmit: (d: StakingForm) => void }) => {
    const price = parseInt(form.watch("price") || "0");
    const returnAmount = parseInt(form.watch("returnAmount") || "0");
    const lockDays = parseInt(form.watch("lockDays") || "0");
    const dailyEarnings = lockDays > 0 ? Math.round(returnAmount / lockDays) : 0;
    const profit = returnAmount - price;

    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du produit</FormLabel>
            <FormControl><Input {...field} placeholder="Ex: Gold Staking 30j" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem>
              <FormLabel>Prix (USDT)</FormLabel>
              <FormControl><Input {...field} type="number" placeholder="Ex: 5000" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="returnAmount" render={({ field }) => (
            <FormItem>
              <FormLabel>Retour total (USDT)</FormLabel>
              <FormControl><Input {...field} type="number" placeholder="Ex: 7500" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="lockDays" render={({ field }) => (
          <FormItem>
            <FormLabel>Durée du cycle (jours)</FormLabel>
            <FormControl><Input {...field} type="number" placeholder="Ex: 30" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Live preview */}
        {price > 0 && returnAmount > 0 && lockDays > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm space-y-1">
            <p className="font-semibold text-amber-800">Aperçu du produit :</p>
            <p className="text-amber-700">• Revenu quotidien : <strong>{dailyEarnings.toLocaleString()} USDT/j</strong></p>
            <p className="text-amber-700">• Retour total : <strong>{returnAmount.toLocaleString()} USDT</strong></p>
            <p className={`font-semibold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>
              • Profit utilisateur : {profit >= 0 ? "+" : ""}{profit.toLocaleString()} USDT ({price > 0 ? ((profit / price) * 100).toFixed(1) : 0}%)
            </p>
          </div>
        )}

        {/* Scheduled launch */}
        <FormField control={form.control} name="launchDate" render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Date de lancement planifiée
              <span className="text-muted-foreground font-normal text-xs">(laisser vide = visible immédiatement)</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
            {field.value && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Visible à partir du : {formatLaunchDate(new Date(field.value))}
              </p>
            )}
          </FormItem>
        )} />

        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem>
            <FormLabel>URL de l'image <span className="text-muted-foreground font-normal">(optionnel)</span></FormLabel>
            <FormControl><Input {...field} placeholder="https://..." /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description <span className="text-muted-foreground font-normal">(optionnel)</span></FormLabel>
            <FormControl><Input {...field} placeholder="Description courte..." /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={isPending} data-testid="button-save-staking">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">Produits de la richesse (Staking)</p>
          <p className="text-xs text-muted-foreground">{products?.length || 0} produit(s) — le capital + gains sont reversés à la fin du cycle</p>
        </div>
        <Button
          onClick={() => { setShowCreate(true); createForm.reset(); }}
          className="bg-amber-500 hover:bg-amber-600 text-white"
          data-testid="button-add-staking"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)
      ) : products && products.length > 0 ? (
        products.map((p) => {
          const scheduled = isScheduled(p);
          const dailyEarnings = Math.round(parseFloat(String(p.returnAmount)) / p.lockDays);
          return (
            <Card key={p.id} className={scheduled ? "border-amber-300" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-foreground">ALLAN {p.name}</p>
                      <Badge variant={p.isActive ? "default" : "outline"} className="text-xs">
                        {p.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      {scheduled && (
                        <Badge className="text-xs bg-amber-100 text-amber-700 border border-amber-300">
                          <Clock className="w-3 h-3 mr-1" />
                          Planifié : {formatLaunchDate(p.launchDate)}
                        </Badge>
                      )}
                      {p.launchDate && !scheduled && (
                        <Badge className="text-xs bg-green-100 text-green-700 border border-green-300">
                          Lancé
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                      <div>
                        <p className="text-muted-foreground">Prix</p>
                        <p className="font-semibold">{p.price.toLocaleString()} USDT</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Retour total</p>
                        <p className="font-semibold text-amber-600">{p.returnAmount.toLocaleString()} USDT</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quotidien</p>
                        <p className="font-semibold">{dailyEarnings.toLocaleString()} USDT</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Durée</p>
                        <p className="font-semibold">{p.lockDays}j</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <Switch
                      checked={p.isActive}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: p.id, isActive: checked })}
                      data-testid={`switch-staking-${p.id}`}
                    />
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)} data-testid={`button-edit-staking-${p.id}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => { if (confirm(`Supprimer "${p.name}" ? Les achats existants ne seront pas affectés.`)) deleteMutation.mutate(p.id); }}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-staking-${p.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          <img src={emptyImg} alt="vide" className="w-32 h-32 mb-3 opacity-70" />
          <p>Aucun produit staking. Créez le premier.</p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={(open) => { if (!open) { setShowCreate(false); createForm.reset(); } }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau produit staking</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <StakingFormFields form={createForm} isPending={createMutation.isPending} onSubmit={(d) => createMutation.mutate(d)} />
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => { if (!open) setEditProduct(null); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier — {editProduct?.name}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <StakingFormFields
              form={editForm}
              isPending={updateMutation.isPending}
              onSubmit={(d) => editProduct && updateMutation.mutate({ id: editProduct.id, data: d })}
            />
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
