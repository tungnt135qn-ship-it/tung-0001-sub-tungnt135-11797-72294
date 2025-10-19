import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Award, Activity, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import walletBanner from "@/assets/wallet-banner.jpg";

interface Profile {
  username: string;
  can_balance: number;
  total_invested: number;
  membership_tier: string;
}

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  const tierColors = {
    bronze: "text-orange-400",
    silver: "text-gray-300",
    gold: "text-yellow-400",
    platinum: "text-cyan-400",
  };

  return (
    <section className="py-12 relative">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${walletBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Xin chào, {profile.username}!
          </h2>
          <p className="text-foreground/60">Dashboard của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-primary/30 hover:border-primary/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Số dư CAN
              </CardTitle>
              <Wallet className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {profile.can_balance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">CAN tokens</p>
            </CardContent>
          </Card>

          <Card className="glass border-secondary/30 hover:border-secondary/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tổng đầu tư
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${profile.total_invested?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">USD</p>
            </CardContent>
          </Card>

          <Card className="glass border-accent/30 hover:border-accent/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Hạng thành viên
              </CardTitle>
              <Award className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold capitalize ${tierColors[profile.membership_tier as keyof typeof tierColors]}`}>
                {profile.membership_tier}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tier level</p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/30 hover:border-primary/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Trạng thái
              </CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                Active
              </div>
              <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
