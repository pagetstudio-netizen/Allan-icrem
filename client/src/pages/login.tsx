import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { FALLBACK_COUNTRIES, type ApiCountry } from "@/lib/countries";
import { CountrySelector } from "@/components/country-selector";
import { Loader2, Eye, EyeOff, Smartphone, Lock, ChevronDown } from "lucide-react";
import allanLogo from "@assets/IMG_20260802_174051_696_1785700564398.jpg";
import authBg from "@assets/auth_banner.jpg";

const loginSchema = z.object({
  phone: z.string().min(6, "Numéro de téléphone invalide"),
  country: z.string().min(2, "Sélectionnez un pays"),
  password: z.string().min(1, "Le mot de passe est requis"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const saved = typeof window !== "undefined" ? localStorage.getItem("allan_credentials") : null;
  const creds = saved ? JSON.parse(saved) : null;

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: creds?.phone || "",
      country: creds?.country || "NE",
      password: creds?.password || "",
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

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    try {
      await login(data.phone, data.country, data.password);
      if (creds) {
        localStorage.setItem("allan_credentials", JSON.stringify({ phone: data.phone, country: data.country, password: data.password }));
      }
      navigate("/");
    } catch (err: any) {
      toast({ title: "Erreur de connexion", description: err.message || "Vérifiez vos informations", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

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
      <div className="relative z-10 flex flex-col justify-center h-full px-6 py-6 max-w-sm mx-auto w-full">

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">

          {/* Phone field */}
          <div
            className="flex items-center rounded-2xl px-4 gap-3 bg-white"
            style={{ height: 54 }}
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
            style={{ height: 54 }}
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
              {showPassword
                ? <Eye className="w-5 h-5 text-gray-400" />
                : <EyeOff className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-300 text-xs px-2 -mt-1">{form.formState.errors.password.message}</p>
          )}

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
            data-testid="button-login"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Connexion...
              </span>
            ) : "Se connecter"}
          </button>
        </form>

        {/* Bottom links */}
        <div className="flex items-center justify-between mt-5 px-1">
          <span
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.45)", cursor: "default" }}
          >
            Mot de passe oublié
          </span>
          <button
            type="button"
            className="text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.85)" }}
            onClick={() => navigate("/register")}
          >
            S'inscrire
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
