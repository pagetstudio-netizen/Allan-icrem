import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { FALLBACK_COUNTRIES, type ApiCountry } from "@/lib/countries";
import { CountrySelector } from "@/components/country-selector";
import { Loader2, Eye, EyeOff, Smartphone, Lock, ChevronDown, LayoutGrid } from "lucide-react";
import allanLogo from "@assets/IMG_20260802_174051_696_1785700564398.jpg";
import authBg from "@assets/auth_banner.jpg";

const registerSchema = z
  .object({
    phone: z.string().min(6, "Numéro de téléphone invalide"),
    country: z.string().min(2, "Sélectionnez un pays"),
    password: z.string().min(6, "Au moins 6 caractères"),
    confirmPassword: z.string().min(1, "Confirmez le mot de passe"),
    invitationCode: z.string().optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const params = new URLSearchParams(searchString);
  const refCode = params.get("ref") || params.get("money") || params.get("reg") || "";

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      country: "NE",
      password: "",
      confirmPassword: "",
      invitationCode: refCode,
    },
  });

  const { data: apiCountries } = useQuery<ApiCountry[]>({ queryKey: ["/api/countries"] });
  const selectedCountry = form.watch("country");

  useEffect(() => {
    if (!apiCountries?.length) return;
    const valid = apiCountries.some(c => c.code === selectedCountry && c.isActive);
    if (!valid) {
      const first = apiCountries.find(c => c.isActive);
      if (first) form.setValue("country", first.code);
    }
  }, [apiCountries, selectedCountry, form]);

  const countryData = (() => {
    if (apiCountries?.length) {
      const c = apiCountries.find(c => c.code === selectedCountry && c.isActive);
      return c ? { phonePrefix: c.phonePrefix, name: c.name } : null;
    }
    const f = FALLBACK_COUNTRIES.find(c => c.code === selectedCountry);
    return f ? { phonePrefix: f.phonePrefix, name: f.name } : null;
  })();

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);
    try {
      await registerUser({
        fullName: `User_${data.phone}`,
        phone: data.phone,
        country: data.country,
        password: data.password,
        invitationCode: data.invitationCode,
      });
      toast({ title: "Inscription réussie !", description: "Bienvenue sur ALLAN Construction !" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Erreur d'inscription", description: err.message || "Une erreur est survenue", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const fieldStyle = {
    height: 54,
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "rgba(10,5,2,0.82)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 py-4 max-w-sm mx-auto w-full">

        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <div
            className="rounded-2xl overflow-hidden mb-3"
            style={{
              width: 110,
              height: 72,
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <img src={allanLogo} alt="ALLAN Construction" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2.5">

          {/* Phone field */}
          <div
            className="flex items-center rounded-2xl px-4 gap-3 bg-white"
            style={fieldStyle}
          >
            <Smartphone className="w-5 h-5 shrink-0" style={{ color: "#6B5B4E" }} />
            <button
              type="button"
              onClick={() => setCountryModalOpen(true)}
              className="flex items-center gap-1 shrink-0 pr-3 font-semibold text-sm"
              style={{ color: "#3D2B1F", borderRight: "1px solid #D6CCC6" }}
              data-testid="button-select-country"
            >
              + {countryData?.phonePrefix || "227"}
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <input
              {...form.register("phone")}
              type="tel"
              placeholder="Veuillez saisir votre numéro de tél."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#2D1F15", caretColor: "#B5533C" }}
              data-testid="input-phone"
            />
          </div>
          {form.formState.errors.phone && (
            <p className="text-red-300 text-xs px-2 -mt-1">{form.formState.errors.phone.message}</p>
          )}

          {/* Password field */}
          <div
            className="flex items-center rounded-2xl px-4 gap-3 bg-white"
            style={fieldStyle}
          >
            <Lock className="w-5 h-5 shrink-0" style={{ color: "#6B5B4E" }} />
            <input
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Veuillez saisir votre mot de passe"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#2D1F15", caretColor: "#B5533C" }}
              data-testid="input-password"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="shrink-0" data-testid="button-toggle-password">
              {showPassword ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-300 text-xs px-2 -mt-1">{form.formState.errors.password.message}</p>
          )}

          {/* Confirm password */}
          <div
            className="flex items-center rounded-2xl px-4 gap-3 bg-white"
            style={fieldStyle}
          >
            <Lock className="w-5 h-5 shrink-0" style={{ color: "#6B5B4E" }} />
            <input
              {...form.register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#2D1F15", caretColor: "#B5533C" }}
              data-testid="input-confirm-password"
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)} className="shrink-0" data-testid="button-toggle-confirm">
              {showConfirm ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-red-300 text-xs px-2 -mt-1">{form.formState.errors.confirmPassword.message}</p>
          )}

          {/* Referral / invitation code */}
          <div
            className="flex items-center rounded-2xl px-4 gap-3 bg-white"
            style={fieldStyle}
          >
            <LayoutGrid className="w-5 h-5 shrink-0" style={{ color: "#6B5B4E" }} />
            <input
              {...form.register("invitationCode")}
              type="text"
              placeholder="Code d'invitation (optionnel)"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#2D1F15", caretColor: "#B5533C" }}
              data-testid="input-invitation-code"
            />
          </div>

          <input type="hidden" {...form.register("country")} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full font-semibold text-base text-white mt-2 active:scale-[0.98] transition-transform disabled:opacity-60"
            style={{
              height: 52,
              background: "linear-gradient(135deg,#C4644A,#B5533C,#9E3D28)",
              boxShadow: "0 4px 18px rgba(181,83,60,0.5)",
              letterSpacing: "0.02em",
            }}
            data-testid="button-register"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Inscription...
              </span>
            ) : "S'inscrire"}
          </button>
        </form>

        {/* Bottom links */}
        <div className="flex items-center justify-between mt-5 px-1">
          <button
            type="button"
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.85)" }}
            onClick={() => navigate("/forgot-password")}
          >
            Mot de passe oublié
          </button>
          <button
            type="button"
            className="text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.85)" }}
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </div>
      </div>

      <CountrySelector
        open={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        onSelect={(code) => form.setValue("country", code, { shouldValidate: true })}
      />
    </div>
  );
}
