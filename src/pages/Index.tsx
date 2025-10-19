import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UserDashboard } from "@/components/UserDashboard";
import { BlockchainStats } from "@/components/BlockchainStats";
import { InvestmentPhases } from "@/components/InvestmentPhases";
import { MembershipTiers } from "@/components/MembershipTiers";
import { NFTMarketplace } from "@/components/NFTMarketplace";
import { Missions } from "@/components/Missions";
import { NewsEvents } from "@/components/NewsEvents";
import { Footer } from "@/components/Footer";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={() => navigate("/auth")} />
      <main>
        <Hero />
        {session && <UserDashboard />}
        <BlockchainStats />
        <InvestmentPhases />
        <MembershipTiers />
        <NFTMarketplace />
        <Missions />
        <NewsEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
