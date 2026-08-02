import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatCurrency, getCountryByCode } from "@/lib/countries";
import { Loader2, AlertTriangle, X, Settings, Coins } from "lucide-react";
import { useLocation } from "wouter";
import type { StakingProduct } from "@shared/schema";

import allanLogoFull from "@assets/allan_logo.jpg";
import productImg1 from "@assets/allan_product_vip1.jpg";
import productImg2 from "@assets/allan_product_vip2.jpg";
import productImg3 from "@assets/allan_product_vip3.jpg";
import productImg4 from "@assets/allan_product_vip4.jpg";
import productImg5 from "@assets/allan_product_vip5.jpg";
import productImg6 from "@assets/allan_product_vip6.jpg";
import productImg7 from "@assets/allan_product_vip7.jpg";
import productImg8 from "@assets/allan_product_vip8.jpg";
import productImg9 from "@assets/allan_product_vip9.jpg";

const PRODUCT_IMAGES = [productImg1, productImg2, productImg3, productImg4, productImg5, productImg6, productImg7, productImg8, productImg9];
const QTY_OPTIONS = [1, 2, 3];

export default function InvestPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<StakingProduct | null>(null);
  const [qty, setQty] = useState(1);

  const { data: products, isLoading } = useQuery<StakingProduct[]>({
    queryKey: ["/api/staking/products"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      for (let i = 0; i < quantity; i++) {
        const response = await apiRequest("POST", `/api/staking/purchase/${productId}`, {});
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Erreur");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staking/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/my"] });
      refreshUser();
      closeSheet();
      toast({ title: "Produit acheté !", description: "Les gains seront versés à la fin du cycle." });
    },
    onError: (error: any) => {
      closeSheet();
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const openSheet = (product: StakingProduct) => { setSelectedProduct(product); setQty(1); };
  const closeSheet = () => { setSelectedProduct(null); setQty(1); };

  if (!user) return null;

  const balance = parseFloat(user.balance || "0");
  const country = getCountryByCode(user.country);
  const currency = country?.currency || "FCFA";

  return (
    <div className="flex flex-col min-h-full bg-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm bg-white">
        <img src={allanLogoFull} alt="ALLAN" className="h-9 w-auto object-contain" data-testid="img-trek-logo" />
      </div>

      {/* Yellow section banner */}
      <div
        className="mx-3 mt-3 mb-2 rounded-2xl px-4 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
      >
        <div>
          <p className="text-white font-extrabold text-base tracking-wide">Produits de la richesse</p>
          <p className="text-yellow-100 text-xs mt-0.5">Produits staking — revenus garantis à terme</p>
        </div>
        <Coins className="w-8 h-8 text-amber-400" />
      </div>

      {/* Products list */}
      <div className="flex-1 overflow-y-auto pb-24 px-3 pt-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)}
          </div>
        ) : products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product, idx) => {
              const img = product.imageUrl || PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length];
              const dailyEarnings = Math.round(parseFloat(String(product.returnAmount)) / product.lockDays);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  data-testid={`product-card-${product.id}`}
                >
                  {/* Top section: image + info */}
                  <div className="flex items-center p-3 gap-3">
                    <div className="w-28 h-24 rounded-xl overflow-hidden shrink-0">
                      <img src={img as string} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="font-extrabold text-gray-900 text-base leading-tight">ALLAN {product.name}</p>
                      <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>
                        Prix: {currency} {Number(product.price).toLocaleString("fr-FR")}
                      </p>
                      <button
                        onClick={() => openSheet(product)}
                        className="w-full py-2 rounded-xl text-white text-sm font-bold"
                        style={{ background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)" }}
                        data-testid={`button-purchase-${product.id}`}
                      >
                        Rejoindre maintenant
                      </button>
                    </div>
                  </div>

                  {/* Bottom stats bar */}
                  <div className="flex items-center justify-around px-3 py-2.5" style={{ background: "#1e3a5f" }}>
                    <div className="text-center">
                      <p className="text-white/60 text-[10px]">Durée de validité</p>
                      <p className="text-white font-bold text-sm">{product.lockDays} jours</p>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                      <p className="text-white/60 text-[10px]">Revenu / jour</p>
                      <p className="text-white font-bold text-sm">{currency} {dailyEarnings.toLocaleString("fr-FR")}</p>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                      <p className="text-white/60 text-[10px]">Gains totaux</p>
                      <p className="text-white font-bold text-sm">{currency} {Number(product.returnAmount).toLocaleString("fr-FR")}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">Aucun produit disponible</p>
          </div>
        )}
      </div>

      {/* Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={closeSheet} />
      )}

      {/* Bottom-sheet */}
      <div
        className="fixed left-0 right-0 z-[60] bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ease-out"
        style={{ bottom: 0, transform: selectedProduct ? "translateY(0)" : "translateY(110%)" }}
      >
        {selectedProduct && (() => {
          const img = selectedProduct.imageUrl || PRODUCT_IMAGES[selectedProduct.id % PRODUCT_IMAGES.length];
          const totalCost = parseFloat(String(selectedProduct.price)) * qty;
          const dailyEarnings = Math.round(parseFloat(String(selectedProduct.returnAmount)) / selectedProduct.lockDays);
          const canAfford = balance >= totalCost;

          return (
            <div className="pb-8">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Header row */}
              <div className="flex items-center gap-3 px-5 pt-2 pb-3 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img src={img as string} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-gray-900 text-base">ALLAN {selectedProduct.name}</p>
                  <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>
                    Prix({currency}): {Number(selectedProduct.price).toLocaleString("fr-FR")}
                  </p>
                </div>
                <button onClick={closeSheet} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quantity selector */}
              <div className="px-5 pt-4 pb-2">
                <p className="text-xs text-gray-500 mb-2 font-medium">Quantité d'achat</p>
                <div className="flex gap-2">
                  {QTY_OPTIONS.map(n => (
                    <button
                      key={n}
                      onClick={() => setQty(n)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={qty === n ? { background: "#f59e0b", color: "#fff" } : { background: "#f3f4f6", color: "#6b7280" }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary rows */}
              <div className="px-5 pt-2 pb-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Revenu quotidien:</span>
                  <span className="font-bold text-sm text-gray-900">{(dailyEarnings * qty).toLocaleString("fr-FR")}{currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Revenu total:</span>
                  <span className="font-bold text-sm text-gray-900">{(parseFloat(String(selectedProduct.returnAmount)) * qty).toLocaleString("fr-FR")}{currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Durée:</span>
                  <span className="font-bold text-sm text-gray-900">{selectedProduct.lockDays} jours</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-gray-700 text-sm font-semibold">Besoin de payer:</span>
                  <span className="font-extrabold text-base" style={{ color: "#f59e0b" }}>
                    {totalCost.toLocaleString("fr-FR")}{currency}
                  </span>
                </div>
                {!canAfford && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-500">
                      Solde insuffisant. Il vous manque {formatCurrency(totalCost - balance, user.country)}.
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="px-5">
                <button
                  onClick={() => purchaseMutation.mutate({ productId: selectedProduct.id, quantity: qty })}
                  disabled={purchaseMutation.isPending || !canAfford}
                  className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)" }}
                  data-testid="button-confirm-purchase"
                >
                  {purchaseMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                  Investir Maintenant
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-3 px-6 leading-relaxed">
                Le capital et les gains seront automatiquement versés sur votre solde à la fin du cycle de {selectedProduct.lockDays} jours.
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
