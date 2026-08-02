import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Copy, CheckCircle, Loader2, ImageIcon, FileText } from "lucide-react";
import { Link } from "wouter";
import { COUNTRIES, type ApiCountry } from "@/lib/countries";
import type { PaymentNumber } from "@shared/schema";

const QUICK_AMOUNTS = [3000, 5000, 10000, 20000, 50000, 100000, 300000, 500000, 1000000];

type Step = "amount" | "select" | "form";

export default function DepositPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("amount");
  const [selectedNumber, setSelectedNumber] = useState<PaymentNumber | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [screenshot, setScreenshot] = useState<string>("");
  const [screenshotName, setScreenshotName] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  // Country the user selected for deposit (may differ from user.country)
  const [selectedDepositCountry, setSelectedDepositCountry] = useState<string>(user?.country || "");

  const userCountry = user?.country || "";

  const { data: apiCountries = [] } = useQuery<ApiCountry[]>({ queryKey: ["/api/countries"] });

  // Fetch ALL payment numbers to discover which countries the admin has configured
  const { data: allPaymentNumbers = [] } = useQuery<PaymentNumber[]>({
    queryKey: ["/api/payment-numbers"],
    queryFn: async () => {
      const res = await fetch(`/api/payment-numbers`, { credentials: "include" });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });

  // Unique countries that have at least one payment number
  const countriesWithNumbers = Array.from(new Set(allPaymentNumbers.map((n) => n.country)));

  const countryInfo =
    apiCountries.length > 0
      ? apiCountries.find((c) => c.code === selectedDepositCountry && c.isActive)
        ?? apiCountries.find((c) => c.code === userCountry && c.isActive)
      : COUNTRIES.find((c) => c.code === selectedDepositCountry);
  const currency = countryInfo?.currency || "FCFA";

  const { data: platformSettings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });
  const MIN_DEPOSIT = parseInt(platformSettings?.minDeposit || "3000");

  const { data: paymentNumbers = [], isLoading: numbersLoading } = useQuery<PaymentNumber[]>({
    queryKey: ["/api/payment-numbers", selectedDepositCountry],
    queryFn: async () => {
      const res = await fetch(`/api/payment-numbers?country=${selectedDepositCountry}`, { credentials: "include" });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    enabled: !!selectedDepositCountry && step !== "amount",
  });

  const finalAmount = customAmount ? parseFloat(customAmount) : (amount as number);
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const copyPhone = async (num: PaymentNumber) => {
    try {
      await navigator.clipboard.writeText(num.phone);
      setCopiedId(num.id);
      setTimeout(() => setCopiedId(null), 2500);
      toast({ title: "✅ Numéro copié !", description: num.phone });
    } catch {
      toast({ title: "Numéro : " + num.phone, description: "Copiez manuellement" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop grand", description: "Max 5 Mo", variant: "destructive" });
      return;
    }
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshot(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const depositMutation = useMutation({
    mutationFn: async () => {
      if (!selectedNumber) throw new Error("Aucun numéro sélectionné");
      if (!screenshot) throw new Error("La capture d'écran est obligatoire");
      const res = await apiRequest("POST", "/api/deposits", {
        amount: finalAmount,
        accountName: user?.fullName || "",
        accountNumber: senderPhone,
        paymentMethod: selectedNumber.operatorName,
        country: selectedDepositCountry,
        paymentNumberId: selectedNumber.id,
        channelName: `${selectedNumber.operatorName} - ${selectedNumber.phone}`,
        screenshot,
        paymentMessage: paymentMessage || null,
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Erreur"); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Demande envoyée !", description: "Votre dépôt est en attente de validation." });
      qc.invalidateQueries({ queryKey: ["/api/deposits/history"] });
      refreshUser();
      setStep("amount");
      setSelectedNumber(null);
      setAmount("");
      setCustomAmount("");
      setSenderPhone(user?.phone || "");
      setScreenshot("");
      setScreenshotName("");
      setPaymentMessage("");
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const handleAmountNext = () => {
    if (!selectedDepositCountry) {
      toast({ title: "Pays requis", description: "Veuillez choisir votre pays de rechargement", variant: "destructive" });
      return;
    }
    const val = customAmount ? parseFloat(customAmount) : (amount as number);
    if (!val || val < MIN_DEPOSIT) {
      toast({ title: "Montant invalide", description: `Minimum ${fmt(MIN_DEPOSIT)} ${currency}`, variant: "destructive" });
      return;
    }
    setStep("select");
  };

  if (!user) return null;
  const balance = parseFloat(user.balance || "0");

  /* ════════════════════════════════════════════════════════════
     STEP 1 — Recharger (matches reference screenshot 1)
  ════════════════════════════════════════════════════════════ */
  if (step === "amount") {
    return (
      <div
        className="flex flex-col min-h-screen pb-28"
        style={{ background: "linear-gradient(160deg,#FFF5EE 0%,#FAF0E0 60%,#FFF5EE 100%)" }}
      >
        {/* Header */}
        <div className="flex items-center px-4 py-4 bg-white border-b border-gray-100">
          <Link href="/account">
            <button className="mr-4 text-gray-800 text-2xl font-bold">‹</button>
          </Link>
          <h1 className="flex-1 text-center text-gray-900 text-base font-bold pr-8">Recharger</h1>
          <Link href="/deposit-history">
            <button className="text-gray-600">
              <FileText className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4">

          {/* Balance card */}
          <div
            className="flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg,#F5C518 0%,#F59E0B 55%,#D97706 100%)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
          >
            <span className="font-bold text-white text-base">Mon solde</span>
            <span className="font-black text-white text-xl">
              {fmt(balance)} <span className="text-sm font-bold">{currency}</span>
            </span>
          </div>

          {/* Pays de rechargement */}
          <div className="bg-white rounded-2xl px-5 py-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#F59E0B" }} />
              <p className="font-bold text-gray-900 text-sm">Choisissez votre pays de rechargement</p>
            </div>

            {countriesWithNumbers.length === 0 ? (
              <p className="text-gray-400 text-xs italic">Aucun pays disponible pour le moment</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {countriesWithNumbers.map((code) => {
                  const info = apiCountries.find((c) => c.code === code)
                    ?? COUNTRIES.find((c) => c.code === code);
                  const isSelected = selectedDepositCountry === code;
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedDepositCountry(code)}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 active:scale-95 transition-all"
                      style={{
                        borderColor: isSelected ? "#F59E0B" : "#E5E7EB",
                        color: isSelected ? "#92400E" : "#374151",
                        background: isSelected
                          ? "linear-gradient(135deg,#FEF9C3,#FEF3C7)"
                          : "#FAFAFA",
                        boxShadow: isSelected ? "0 2px 8px rgba(245,158,11,0.25)" : "none",
                      }}
                      data-testid={`btn-country-${code}`}
                    >
                      {info?.name || code}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Amount selector */}
          <div className="bg-white rounded-2xl px-5 py-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full" style={{ background: "#F59E0B" }} />
              <p className="font-bold text-gray-900 text-sm">Rechargement de solde</p>
            </div>

            {/* 3×3 preset grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {QUICK_AMOUNTS.map((q) => {
                const isSelected = amount === q && !customAmount;
                return (
                  <button
                    key={q}
                    onClick={() => { setAmount(q); setCustomAmount(""); }}
                    className="py-3 rounded-xl text-sm font-bold border-2 active:scale-95 transition-all"
                    style={{
                      borderColor: isSelected ? "#EF4444" : "#E5E7EB",
                      color: isSelected ? "#EF4444" : "#374151",
                      background: isSelected ? "#FFF5F5" : "#FAFAFA",
                    }}
                    data-testid={`btn-amount-${q}`}
                  >
                    {fmt(q)}
                  </button>
                );
              })}
            </div>

            {/* Custom amount input */}
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ border: "1.5px solid #E5E7EB", background: "#FAFAFA" }}
            >
              <span className="px-4 py-4 text-sm font-bold text-gray-700 border-r border-gray-200">{currency}</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
                placeholder="Entrez le montant du recharge"
                className="flex-1 px-4 py-4 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
                data-testid="input-deposit-amount"
              />
            </div>
          </div>

          {/* Envoyer button */}
          <button
            onClick={handleAmountNext}
            className="w-full py-4 rounded-full font-bold text-sm active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
              color: "#3D1A00",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
            }}
            data-testid="button-recharge-now"
          >
            Envoyer
          </button>

          {/* Rappel amical */}
          <div
            className="rounded-2xl px-5 py-5 bg-white"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}
          >
            <p className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                style={{ background: "#EF4444" }}
              >!</span>
              Rappel amical
            </p>
            <p className="text-gray-600 text-sm mb-3">Le service de dépôt est ouvert 24h/24.</p>
            <div className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
              {[
                `1. Montant minimum de dépôt : ${fmt(MIN_DEPOSIT)} ${currency}\n   Montant maximum par dépôt : 5 000 000 ${currency}`,
                "2. Vérifiez attentivement vos informations avant de payer.",
                "3. Après le virement, joignez la capture d'écran de confirmation.",
                "4. Délai de validation : 10 à 30 minutes. Contactez le support si le montant n'est pas crédité.",
              ].map((text, i) => (
                <p key={i} className="whitespace-pre-line">{text}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Floating back button */}
        <button
          onClick={() => window.history.back()}
          className="fixed bottom-24 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-20 active:scale-95 transition-transform"
          style={{ background: "#1B3A6B" }}
        >
          <span className="text-white font-bold text-sm">«</span>
        </button>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     STEP 2 — Choisir l'opérateur (matches reference screenshot 2)
  ════════════════════════════════════════════════════════════ */
  if (step === "select") {
    return (
      <div
        className="flex flex-col min-h-screen pb-28"
        style={{ background: "#1B4FA0" }}
      >
        {/* Header */}
        <div className="flex items-center px-4 py-4" style={{ background: "#1B4FA0" }}>
          <button onClick={() => setStep("amount")} className="mr-4 text-white text-2xl font-bold">‹</button>
          <h1 className="flex-1 text-center text-white text-base font-bold pr-8">Recharger</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8 space-y-4">

          {/* Amount display */}
          <div className="mb-2">
            <p className="text-white/80 text-lg font-medium">Montant:</p>
            <p className="text-white font-black" style={{ fontSize: "clamp(32px,8vw,40px)", lineHeight: 1.1 }}>
              {fmt(finalAmount)}.00 <span className="text-2xl font-bold">{currency}</span>
            </p>
          </div>

          <p className="text-white/90 text-base font-medium">Sélectionnez le mode de paiement :</p>

          {/* Operators list */}
          {numbersLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <p className="text-white/60 text-sm">Chargement des opérateurs...</p>
            </div>
          ) : paymentNumbers.length === 0 ? (
            <div
              className="rounded-2xl px-5 py-10 text-center bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <p className="text-white font-semibold text-sm">Aucun opérateur disponible</p>
              <p className="text-white/60 text-xs mt-1">Contactez le support</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentNumbers.map((num) => (
                <button
                  key={num.id}
                  onClick={() => { setSelectedNumber(num); setStep("form"); }}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white active:scale-[0.98] transition-transform"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
                  data-testid={`button-select-${num.id}`}
                >
                  <span className="font-bold text-gray-900 text-base">{num.operatorName}</span>
                  <ChevronRight className="w-5 h-5 text-gray-500 stroke-[2.5]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     STEP 3 — Confirmation (matches reference screenshot 3)
  ════════════════════════════════════════════════════════════ */
  if (step === "form" && selectedNumber) {
    return (
      <div
        className="flex flex-col min-h-screen pb-28"
        style={{ background: "#1B4FA0" }}
      >
        {/* Header */}
        <div className="flex items-center px-4 py-4" style={{ background: "#1B4FA0" }}>
          <button onClick={() => setStep("select")} className="mr-4 text-white text-2xl font-bold">‹</button>
          <h1 className="flex-1 text-center text-white text-base font-bold pr-8">Recharger</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8 space-y-4">

          {/* Amount display */}
          <div className="mb-1">
            <p className="text-white/80 text-lg font-medium">Montant:</p>
            <p className="text-white font-black" style={{ fontSize: "clamp(32px,8vw,40px)", lineHeight: 1.1 }}>
              {fmt(finalAmount)}.00 <span className="text-2xl font-bold">{currency}</span>
            </p>
          </div>

          {/* White card */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>

            {/* Step progress indicator */}
            <div className="px-6 pt-5 pb-4">
              <div className="flex items-start justify-between relative">
                {/* Line connector */}
                <div
                  className="absolute top-4 left-0 right-0 h-px"
                  style={{ background: "#E5E7EB", marginLeft: "16px", marginRight: "16px", zIndex: 0 }}
                />
                {[
                  { n: 1, label: "Numéro de\ntéléphone" },
                  { n: 2, label: "Informations de\nconfirmation" },
                  { n: 3, label: "Paiement\nterminé" },
                ].map(({ n, label }) => (
                  <div key={n} className="flex flex-col items-center gap-1.5 relative z-10">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={
                        n === 1
                          ? { background: "#1B4FA0", color: "#fff", boxShadow: "0 2px 8px rgba(27,79,160,0.4)" }
                          : { background: "#fff", color: "#9CA3AF", border: "2px solid #E5E7EB" }
                      }
                    >
                      {n}
                    </div>
                    <p
                      className="text-center whitespace-pre-line leading-snug"
                      style={{ fontSize: "10px", color: n === 1 ? "#1B4FA0" : "#9CA3AF", fontWeight: n === 1 ? 600 : 400 }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 pb-5 space-y-4">

              {/* Warning */}
              <div
                className="rounded-xl px-4 py-3 text-sm text-amber-800"
                style={{ background: "#FEF3C7", border: "1px solid #F59E0B" }}
              >
                Veuillez sélectionner la même option que votre méthode de transfert.
              </div>

              {/* Admin payment number to copy */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Numéro de paiement ({selectedNumber.operatorName}) :
                </p>
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE" }}
                >
                  <div>
                    <p className="font-black text-gray-900 text-xl font-mono tracking-wider">{selectedNumber.phone}</p>
                    {selectedNumber.ownerName && (
                      <p className="text-xs text-gray-500 mt-0.5">{selectedNumber.ownerName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => copyPhone(selectedNumber)}
                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl active:scale-95 transition-all"
                    style={
                      copiedId === selectedNumber.id
                        ? { background: "#D1FAE5", color: "#065F46" }
                        : { background: "#1B4FA0", color: "#fff" }
                    }
                    data-testid="button-copy-number"
                  >
                    {copiedId === selectedNumber.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    <span className="text-[10px] font-bold">
                      {copiedId === selectedNumber.id ? "Copié !" : "Copier"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sender phone */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Veuillez entrer votre numéro de téléphone :
                </p>
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid #E5E7EB", background: "#FAFAFA" }}
                >
                  <span className="px-3 py-3.5 text-sm font-semibold text-gray-600 border-r border-gray-200 flex items-center gap-1">
                    {countryInfo?.phonePrefix ? `+${countryInfo.phonePrefix}` : "+227"}
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="Numéro payeur"
                    className="flex-1 px-3 py-3.5 text-sm text-gray-700 outline-none bg-transparent"
                    data-testid="input-sender-phone"
                  />
                </div>
              </div>

              {/* Transfer method selected */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Choisissez la méthode de transfert :</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: "#1B4FA0" }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1B4FA0" }} />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{selectedNumber.operatorName}</span>
                </label>
              </div>

              {/* Screenshot upload — required */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Capture d'écran du paiement <span className="text-red-500 font-bold">*</span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-screenshot"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-2 transition-all active:scale-[0.98]"
                  style={
                    screenshot
                      ? { borderColor: "#10B981", background: "#ECFDF5" }
                      : { borderColor: "#D1D5DB", background: "#F9FAFB" }
                  }
                  data-testid="button-upload-screenshot"
                >
                  {screenshot ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <p className="text-sm font-semibold text-green-700">{screenshotName}</p>
                      <p className="text-xs text-gray-400">Appuyez pour changer</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-600">Ajouter la capture d'écran</p>
                      <p className="text-xs text-gray-400">JPG, PNG — max 5 Mo</p>
                    </>
                  )}
                </button>
                {screenshot && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                    <img src={screenshot} alt="Capture" className="w-full max-h-48 object-contain bg-gray-50" />
                  </div>
                )}
              </div>

              {/* Payment message — optional */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Message reçu <span className="text-gray-400 font-normal text-xs">(optionnel)</span>
                </p>
                <textarea
                  value={paymentMessage}
                  onChange={(e) => setPaymentMessage(e.target.value)}
                  placeholder="Collez ici le SMS de confirmation reçu..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-gray-700 rounded-xl outline-none resize-none"
                  style={{ border: "1.5px solid #E5E7EB", background: "#FAFAFA" }}
                  data-testid="input-payment-message"
                />
              </div>

              {/* Buttons row */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep("select")}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                  style={{ background: "#F3F4F6", color: "#4B5563" }}
                >
                  ‹ Go Back
                </button>
                <button
                  onClick={() => depositMutation.mutate()}
                  disabled={depositMutation.isPending || !screenshot || !senderPhone.trim()}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 active:scale-95 transition-transform"
                  style={{ background: "#1B4FA0" }}
                  data-testid="button-submit-deposit"
                >
                  {depositMutation.isPending ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" /> Envoi...
                    </span>
                  ) : "Soumettre ›"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
