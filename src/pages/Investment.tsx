import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InvestmentHero } from "@/components/InvestmentHero";
import { UserDashboard } from "@/components/UserDashboard";
import { InvestmentPhases } from "@/components/InvestmentPhases";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BlockchainStats } from "@/components/BlockchainStats";
import { CompanyInfo } from "@/components/CompanyInfo";

const Investment = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setSession(session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} onSignOut={() => navigate("/auth")} />
      <main className="flex-1">
        {/* Investment Hero with Charts & Metrics */}
        <InvestmentHero />

        {/* User Dashboard */}
        <UserDashboard />

        {/* Investment Phases */}
        <InvestmentPhases />

        {/* Transaction History */}
        <section className="py-12 bg-gradient-to-br from-background to-background/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <TransactionHistory />
            </div>
          </div>
        </section>

        {/* Blockchain Stats */}
        <BlockchainStats />

        {/* Company & Token Info */}
        <CompanyInfo />
      </main>
      <Footer />
    </div>
  );
};

export default Investment;
