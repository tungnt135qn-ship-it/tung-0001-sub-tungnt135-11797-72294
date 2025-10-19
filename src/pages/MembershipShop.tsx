import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TierPackages } from "@/components/membership-shop/TierPackages";
import { P2PMarketplace } from "@/components/membership-shop/P2PMarketplace";
import { UserTierInfo } from "@/components/membership-shop/UserTierInfo";
import { RealtimeHistory } from "@/components/membership-shop/RealtimeHistory";
import { TransactionTrends } from "@/components/membership-shop/TransactionTrends";
import type { Session } from "@supabase/supabase-js";

const MembershipShop = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 pt-20 pb-4">
        <div className="mb-3 text-center animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            <span className="gradient-text">Nâng cấp hạng thành viên</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Mua gói hạng để nhận NFT độc quyền và hưởng đặc quyền cao cấp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left side - 8/12 */}
          <div className="lg:col-span-8 space-y-3">
            <TierPackages />
            <P2PMarketplace />
          </div>

          {/* Right side - 4/12 */}
          <div className="lg:col-span-4 space-y-3">
            <UserTierInfo />
            <TransactionTrends />
            <RealtimeHistory />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MembershipShop;
