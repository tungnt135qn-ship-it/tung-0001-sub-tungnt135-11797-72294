import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Coins, Package, Lock, TrendingUp, Clock, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Session } from "@supabase/supabase-js";

interface Profile {
  can_balance: number;
}

interface StakingCoin {
  id: string;
  amount_staked: number;
  rewards: number;
  apy: number;
  staked_at: string;
  locked_until: string;
  status: string;
}

interface StakingNFT {
  id: string;
  nft_id: string;
  nft_name: string;
  nft_value: number;
  rewards: number;
  apy: number;
  staked_at: string;
  locked_until: string;
  status: string;
}

const Staking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [coinStakes, setCoinStakes] = useState<StakingCoin[]>([]);
  const [nftStakes, setNFTStakes] = useState<StakingNFT[]>([]);
  
  const [coinAmount, setCoinAmount] = useState("");
  const [coinDuration, setCoinDuration] = useState("30");
  
  const [selectedNFT, setSelectedNFT] = useState("");
  const [nftDuration, setNFTDuration] = useState("30");

  // Available NFTs for staking (mock data - should come from user's NFTs)
  const availableNFTs = [
    { id: "nft-1", name: "Premium Business NFT", value: 50000 },
    { id: "nft-2", name: "Elite Investment NFT", value: 100000 },
    { id: "nft-3", name: "Diamond Tier NFT", value: 250000 },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchStakes(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchStakes(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("can_balance")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const fetchStakes = async (userId: string) => {
    // Fetch coin stakes
    const { data: coinData, error: coinError } = await supabase
      .from("staking_coin")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!coinError && coinData) {
      setCoinStakes(coinData);
    }

    // Fetch NFT stakes
    const { data: nftData, error: nftError } = await supabase
      .from("staking_nft")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!nftError && nftData) {
      setNFTStakes(nftData);
    }
  };

  const handleCoinStake = async () => {
    if (!session) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thực hiện staking",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const amount = parseFloat(coinAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số lượng CAN hợp lệ",
        variant: "destructive",
      });
      return;
    }

    if (profile && amount > profile.can_balance) {
      toast({
        title: "Lỗi",
        description: "Số dư không đủ",
        variant: "destructive",
      });
      return;
    }

    const days = parseInt(coinDuration);
    const apy = 10; // 10% APY
    const rewards = (amount * apy * days) / (365 * 100);
    const lockedUntil = new Date();
    lockedUntil.setDate(lockedUntil.getDate() + days);

    const { error } = await supabase.from("staking_coin").insert({
      user_id: session.user.id,
      amount_staked: amount,
      rewards: rewards,
      apy: apy,
      locked_until: lockedUntil.toISOString(),
      status: "active",
    });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện staking. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    // Update profile balance
    await supabase
      .from("profiles")
      .update({ can_balance: (profile?.can_balance || 0) - amount })
      .eq("id", session.user.id);

    toast({
      title: "Thành công",
      description: `Đã stake ${amount} CAN. Phần thưởng dự kiến: ${rewards.toFixed(2)} CAN`,
    });

    setCoinAmount("");
    fetchProfile(session.user.id);
    fetchStakes(session.user.id);
  };

  const handleNFTStake = async () => {
    if (!session) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thực hiện staking",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedNFT) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn NFT để stake",
        variant: "destructive",
      });
      return;
    }

    const nft = availableNFTs.find(n => n.id === selectedNFT);
    if (!nft) return;

    const days = parseInt(nftDuration);
    const apy = 15; // 15% APY for NFTs
    const rewards = (nft.value * apy * days) / (365 * 100);
    const lockedUntil = new Date();
    lockedUntil.setDate(lockedUntil.getDate() + days);

    const { error } = await supabase.from("staking_nft").insert({
      user_id: session.user.id,
      nft_id: nft.id,
      nft_name: nft.name,
      nft_value: nft.value,
      rewards: rewards,
      apy: apy,
      locked_until: lockedUntil.toISOString(),
      status: "active",
    });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện staking. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: `Đã stake NFT ${nft.name}. Phần thưởng dự kiến: ${rewards.toFixed(2)} CAN`,
    });

    setSelectedNFT("");
    fetchStakes(session.user.id);
  };

  const handleClaim = async (stakeId: string, type: "coin" | "nft") => {
    if (type === "coin") {
      const { data: stake } = await supabase
        .from("staking_coin")
        .select("*")
        .eq("id", stakeId)
        .single();

      if (!stake) return;

      const now = new Date();
      const lockedUntil = new Date(stake.locked_until);

      if (now < lockedUntil) {
        toast({
          title: "Chưa đến thời gian",
          description: "Chưa thể nhận phần thưởng. Vui lòng đợi đến khi hết thời gian khóa.",
          variant: "destructive",
        });
        return;
      }

      // Update stake status
      await supabase
        .from("staking_coin")
        .update({ status: "claimed" })
        .eq("id", stakeId);

      // Add rewards to balance
      if (session) {
        const totalReturn = stake.amount_staked + stake.rewards;

        await supabase
          .from("profiles")
          .update({ can_balance: (profile?.can_balance || 0) + totalReturn })
          .eq("id", session.user.id);

        toast({
          title: "Thành công",
          description: `Đã nhận ${totalReturn.toFixed(2)} CAN`,
        });

        fetchProfile(session.user.id);
        fetchStakes(session.user.id);
      }
    } else {
      const { data: stake } = await supabase
        .from("staking_nft")
        .select("*")
        .eq("id", stakeId)
        .single();

      if (!stake) return;

      const now = new Date();
      const lockedUntil = new Date(stake.locked_until);

      if (now < lockedUntil) {
        toast({
          title: "Chưa đến thời gian",
          description: "Chưa thể nhận phần thưởng. Vui lòng đợi đến khi hết thời gian khóa.",
          variant: "destructive",
        });
        return;
      }

      // Update stake status
      await supabase
        .from("staking_nft")
        .update({ status: "claimed" })
        .eq("id", stakeId);

      // Add rewards to balance
      if (session) {
        const totalReturn = stake.rewards;

        await supabase
          .from("profiles")
          .update({ can_balance: (profile?.can_balance || 0) + totalReturn })
          .eq("id", session.user.id);

        toast({
          title: "Thành công",
          description: `Đã nhận ${totalReturn.toFixed(2)} CAN`,
        });

        fetchProfile(session.user.id);
        fetchStakes(session.user.id);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    navigate("/auth");
    return null;
  }

  const totalCoinStaked = coinStakes
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + s.amount_staked, 0);
  
  const totalCoinRewards = coinStakes
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + s.rewards, 0);

  const totalNFTValue = nftStakes
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + s.nft_value, 0);
  
  const totalNFTRewards = nftStakes
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + s.rewards, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Staking</h1>
          <p className="text-muted-foreground">
            Stake CAN token hoặc NFT để nhận phần thưởng
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tổng CAN đã stake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{totalCoinStaked.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Phần thưởng CAN</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-500">{totalCoinRewards.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Giá trị NFT đã stake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{totalNFTValue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Phần thưởng NFT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-500">{totalNFTRewards.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="coin" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="coin">Staking CAN</TabsTrigger>
            <TabsTrigger value="nft">Staking NFT</TabsTrigger>
          </TabsList>

          {/* CAN Staking */}
          <TabsContent value="coin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Stake CAN Token
                  </CardTitle>
                  <CardDescription>
                    APY: 10% | Số dư khả dụng: {profile?.can_balance.toLocaleString() || 0} CAN
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số lượng CAN</label>
                    <Input
                      type="number"
                      placeholder="Nhập số lượng CAN"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Thời gian khóa (ngày)</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={coinDuration}
                      onChange={(e) => setCoinDuration(e.target.value)}
                    >
                      <option value="30">30 ngày</option>
                      <option value="60">60 ngày</option>
                      <option value="90">90 ngày</option>
                      <option value="180">180 ngày</option>
                    </select>
                  </div>

                  {coinAmount && (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Phần thưởng dự kiến:</span>
                        <span className="font-bold text-green-500">
                          {((parseFloat(coinAmount) * 10 * parseInt(coinDuration)) / (365 * 100)).toFixed(2)} CAN
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tổng nhận về:</span>
                        <span className="font-bold">
                          {(parseFloat(coinAmount) + (parseFloat(coinAmount) * 10 * parseInt(coinDuration)) / (365 * 100)).toFixed(2)} CAN
                        </span>
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={handleCoinStake}>
                    <Lock className="h-4 w-4 mr-2" />
                    Stake CAN
                  </Button>
                </CardContent>
              </Card>

              {/* Active Stakes */}
              <Card>
                <CardHeader>
                  <CardTitle>Lệnh Stake Đang Hoạt Động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coinStakes.filter(s => s.status === "active").length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Chưa có lệnh stake nào
                    </p>
                  ) : (
                    coinStakes
                      .filter(s => s.status === "active")
                      .map((stake) => {
                        const now = new Date();
                        const lockedUntil = new Date(stake.locked_until);
                        const stakedAt = new Date(stake.staked_at);
                        const totalDuration = lockedUntil.getTime() - stakedAt.getTime();
                        const elapsed = now.getTime() - stakedAt.getTime();
                        const progress = Math.min((elapsed / totalDuration) * 100, 100);
                        const canClaim = now >= lockedUntil;

                        return (
                          <Card key={stake.id} className="border-primary/20">
                            <CardContent className="pt-6 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-lg">
                                    {stake.amount_staked.toLocaleString()} CAN
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    APY: {stake.apy}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-green-500 font-medium">
                                    +{stake.rewards.toFixed(2)} CAN
                                  </p>
                                  <p className="text-xs text-muted-foreground">Phần thưởng</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {canClaim ? "Đã đến hạn" : "Đang khóa"}
                                  </span>
                                  <span>{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} />
                                <p className="text-xs text-muted-foreground text-right">
                                  Mở khóa: {lockedUntil.toLocaleDateString("vi-VN")}
                                </p>
                              </div>

                              <Button
                                className="w-full"
                                variant={canClaim ? "default" : "secondary"}
                                disabled={!canClaim}
                                onClick={() => handleClaim(stake.id, "coin")}
                              >
                                {canClaim ? "Nhận phần thưởng" : "Đang khóa"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFT Staking */}
          <TabsContent value="nft" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Stake NFT
                  </CardTitle>
                  <CardDescription>APY: 15%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Chọn NFT</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={selectedNFT}
                      onChange={(e) => setSelectedNFT(e.target.value)}
                    >
                      <option value="">-- Chọn NFT --</option>
                      {availableNFTs.map((nft) => (
                        <option key={nft.id} value={nft.id}>
                          {nft.name} ({nft.value.toLocaleString()} CAN)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Thời gian khóa (ngày)</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={nftDuration}
                      onChange={(e) => setNFTDuration(e.target.value)}
                    >
                      <option value="30">30 ngày</option>
                      <option value="60">60 ngày</option>
                      <option value="90">90 ngày</option>
                      <option value="180">180 ngày</option>
                    </select>
                  </div>

                  {selectedNFT && (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Giá trị NFT:</span>
                        <span className="font-bold">
                          {availableNFTs.find(n => n.id === selectedNFT)?.value.toLocaleString()} CAN
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Phần thưởng dự kiến:</span>
                        <span className="font-bold text-green-500">
                          {(((availableNFTs.find(n => n.id === selectedNFT)?.value || 0) * 15 * parseInt(nftDuration)) / (365 * 100)).toFixed(2)} CAN
                        </span>
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={handleNFTStake} disabled={!selectedNFT}>
                    <Lock className="h-4 w-4 mr-2" />
                    Stake NFT
                  </Button>
                </CardContent>
              </Card>

              {/* Active Stakes */}
              <Card>
                <CardHeader>
                  <CardTitle>NFT Đang Stake</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nftStakes.filter(s => s.status === "active").length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Chưa có NFT stake nào
                    </p>
                  ) : (
                    nftStakes
                      .filter(s => s.status === "active")
                      .map((stake) => {
                        const now = new Date();
                        const lockedUntil = new Date(stake.locked_until);
                        const stakedAt = new Date(stake.staked_at);
                        const totalDuration = lockedUntil.getTime() - stakedAt.getTime();
                        const elapsed = now.getTime() - stakedAt.getTime();
                        const progress = Math.min((elapsed / totalDuration) * 100, 100);
                        const canClaim = now >= lockedUntil;

                        return (
                          <Card key={stake.id} className="border-primary/20">
                            <CardContent className="pt-6 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">{stake.nft_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Giá trị: {stake.nft_value.toLocaleString()} CAN
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    APY: {stake.apy}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-green-500 font-medium">
                                    +{stake.rewards.toFixed(2)} CAN
                                  </p>
                                  <p className="text-xs text-muted-foreground">Phần thưởng</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {canClaim ? "Đã đến hạn" : "Đang khóa"}
                                  </span>
                                  <span>{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} />
                                <p className="text-xs text-muted-foreground text-right">
                                  Mở khóa: {lockedUntil.toLocaleDateString("vi-VN")}
                                </p>
                              </div>

                              <Button
                                className="w-full"
                                variant={canClaim ? "default" : "secondary"}
                                disabled={!canClaim}
                                onClick={() => handleClaim(stake.id, "nft")}
                              >
                                {canClaim ? "Nhận phần thưởng" : "Đang khóa"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Thông tin Staking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Staking CAN Token</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• APY: 10%</li>
                  <li>• Phần thưởng được tính ngay khi stake</li>
                  <li>• CAN sẽ bị khóa trong thời gian stake</li>
                  <li>• Nhận cả vốn và lãi khi đáo hạn</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Staking NFT</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• APY: 15%</li>
                  <li>• Phần thưởng được tính ngay khi stake</li>
                  <li>• NFT sẽ bị khóa trong thời gian stake</li>
                  <li>• Nhận phần thưởng bằng CAN token</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Staking;