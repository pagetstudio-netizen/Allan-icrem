import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import BottomNav from "@/components/bottom-nav";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import HomePage from "@/pages/home";
import TasksPage from "@/pages/tasks";
import AvisPage from "@/pages/avis";
import InvestPage from "@/pages/invest";
import OrdersPage from "@/pages/orders";
import TeamPage from "@/pages/team";
import AccountPage from "@/pages/account";
import AdminPage from "@/pages/admin";
import AdminTeamPage from "@/pages/admin-team";
import BankerPage from "@/pages/banker";
import DepositPage from "@/pages/deposit";
import WithdrawalPage from "@/pages/withdrawal";
import DepositHistoryPage from "@/pages/deposit-history";
import DepositsHistoryPage from "@/pages/deposit-history-real";
import HistoryPage from "@/pages/history";
import ServicePage from "@/pages/service";
import WalletPage from "@/pages/wallet";
import ChangePasswordPage from "@/pages/change-password";
import AboutPage from "@/pages/about";
import RulesPage from "@/pages/rules";
import GiftCodePage from "@/pages/gift-code";
import TeamDetailsPage from "@/pages/team-details";
import MyProductsPage from "@/pages/my-products";
import CheckinPage from "@/pages/checkin";
import WheelPage from "@/pages/wheel";
import RewardsPage from "@/pages/rewards";
import WithdrawalHistoryPage from "@/pages/withdrawal-history";
import DepositOrdersPage from "@/pages/deposit-orders";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

/** Bridges auth → language: auto-detects language from the logged-in user's
 *  country, but only if the user has never manually chosen a language. */
function LanguageAutoDetect() {
  const { user } = useAuth();
  const { autoDetect } = useLanguage();
  useEffect(() => {
    if (user?.country) autoDetect(user.country);
  }, [user?.country]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Compte suspendu</h1>
          <p className="text-muted-foreground">Votre compte a été suspendu. Contactez le support.</p>
        </div>
      </div>
    );
  }

  if ((user as any).isBanker && !user.isAdmin && location !== "/banker") {
    return <Redirect to="/banker" />;
  }

  return <>{children}</>;
}

function BankerRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  if (!(user as any).isBanker && !user.isAdmin) return <Redirect to="/" />;

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16">
      {children}
      <BottomNav />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </Route>
      <Route path="/register">
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      </Route>
      <Route path="/invitation">
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      </Route>
      <Route path="/rejoindre">
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      </Route>
      <Route path="/meilleurs/inscription">
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      </Route>
      <Route path="/">
        <ProtectedRoute>
          <AppLayout>
            <HomePage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/tasks">
        <ProtectedRoute>
          <AppLayout>
            <TasksPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/invest">
        <ProtectedRoute>
          <AppLayout>
            <InvestPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/orders">
        <ProtectedRoute>
          <AppLayout>
            <OrdersPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/team">
        <ProtectedRoute>
          <AppLayout>
            <TeamPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/my-products">
        <ProtectedRoute>
          <AppLayout>
            <MyProductsPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/commande">
        <ProtectedRoute>
          <AppLayout>
            <MyProductsPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/avis">
        <ProtectedRoute>
          <AppLayout>
            <AvisPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/checkin">
        <ProtectedRoute>
          <AppLayout>
            <CheckinPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/wheel">
        <ProtectedRoute>
          <AppLayout>
            <WheelPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/account">
        <ProtectedRoute>
          <AppLayout>
            <AccountPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/deposit">
        <ProtectedRoute>
          <DepositPage />
        </ProtectedRoute>
      </Route>
      <Route path="/withdrawal">
        <ProtectedRoute>
          <WithdrawalPage />
        </ProtectedRoute>
      </Route>
      <Route path="/deposit-history">
        <ProtectedRoute>
          <DepositHistoryPage />
        </ProtectedRoute>
      </Route>
      <Route path="/deposits-history">
        <ProtectedRoute>
          <DepositsHistoryPage />
        </ProtectedRoute>
      </Route>
      <Route path="/history">
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      </Route>
      <Route path="/withdrawal-history">
        <ProtectedRoute>
          <WithdrawalHistoryPage />
        </ProtectedRoute>
      </Route>
      <Route path="/deposit-orders">
        <ProtectedRoute>
          <DepositOrdersPage />
        </ProtectedRoute>
      </Route>
      <Route path="/service">
        <ProtectedRoute>
          <ServicePage />
        </ProtectedRoute>
      </Route>
      <Route path="/wallet">
        <ProtectedRoute>
          <WalletPage />
        </ProtectedRoute>
      </Route>
      <Route path="/change-password">
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      </Route>
      <Route path="/about">
        <ProtectedRoute>
          <AboutPage />
        </ProtectedRoute>
      </Route>
      <Route path="/rules">
        <ProtectedRoute>
          <RulesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/gift-code">
        <ProtectedRoute>
          <GiftCodePage />
        </ProtectedRoute>
      </Route>
      <Route path="/team-details">
        <ProtectedRoute>
          <TeamDetailsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/daily-bonus">
        <ProtectedRoute>
          <AppLayout>
            <RewardsPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      </Route>
      <Route path="/admin/team/:id">
        <AdminRoute>
          <AdminTeamPage />
        </AdminRoute>
      </Route>
      <Route path="/banker">
        <BankerRoute>
          <BankerPage />
        </BankerRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <LanguageAutoDetect />
            <Router />
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
