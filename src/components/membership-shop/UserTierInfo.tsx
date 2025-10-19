import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Award, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Profile {
  username: string;
  can_balance: number;
  membership_tier: string;
}

const tierInfo = {
  bronze: { name: "Bronze", color: "text-amber-600", next: "Silver", required: 250 },
  silver: { name: "Silver", color: "text-gray-400", next: "Gold", required: 750 },
  gold: { name: "Gold", color: "text-yellow-400", next: "Platinum", required: 2500 },
  platinum: { name: "Platinum", color: "text-cyan-400", next: "MAX", required: 0 },
};

export const UserTierInfo = () => {
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

  if (!profile) {
    return (
      <Card className="glass border-border/50 animate-fade-in">
        <CardContent className="py-6 text-center">
          <p className="text-xs text-muted-foreground">Đăng nhập để xem thông tin</p>
        </CardContent>
      </Card>
    );
  }

  const currentTier = tierInfo[profile.membership_tier as keyof typeof tierInfo];
  const progressToNext = currentTier.next !== "MAX" 
    ? (profile.can_balance / currentTier.required) * 100 
    : 100;

  return (
    <Card className="glass border-border/50 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          Tài khoản của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CAN Balance - Compact */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground mb-1">Số dư CAN</div>
          <div className="text-2xl font-bold gradient-text">
            {profile.can_balance.toLocaleString()}
          </div>
        </div>

        {/* Current Tier - Compact */}
        <div className="flex items-center justify-between bg-muted/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Hạng</span>
          </div>
          <div className={`text-base font-bold ${currentTier.color}`}>
            {currentTier.name}
          </div>
        </div>

        {/* Progress to Next Tier - Compact */}
        {currentTier.next !== "MAX" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>Lên {currentTier.next}</span>
              </div>
              <span className="text-[10px] font-semibold text-primary">
                {Math.min(Math.round(progressToNext), 100)}%
              </span>
            </div>
            
            <Progress value={Math.min(progressToNext, 100)} className="h-1.5" />
            
            <div className="text-[10px] text-muted-foreground text-center">
              {profile.can_balance.toLocaleString()} / {currentTier.required.toLocaleString()} CAN
            </div>
          </div>
        )}

        {/* Stats - Compact */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
          <div className="bg-muted/20 rounded p-2 text-center">
            <div className="text-base font-bold text-primary">
              {Math.floor(profile.can_balance / 100)}
            </div>
            <div className="text-[10px] text-muted-foreground">Gói mua</div>
          </div>
          <div className="bg-muted/20 rounded p-2 text-center">
            <div className="text-base font-bold text-secondary">
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <div className="text-[10px] text-muted-foreground">NFT</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
