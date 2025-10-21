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
import { Coins, Package, TrendingUp, Clock, Gift, Sparkles, Zap, ArrowUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Session } from "@supabase/supabase-js";
import stakingCoinHero from "@/assets/staking-coin-hero.jpg";
import stakingNftHero from "@/assets/staking-nft-hero.jpg";

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
  const [selectedNFT, setSelectedNFT] = useState("");

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

    const apy = 10; // 10% APY
    const lockedUntil = new Date();
    lockedUntil.setFullYear(lockedUntil.getFullYear() + 10);

    const { error } = await supabase.from("staking_coin").insert({
      user_id: session.user.id,
      amount_staked: amount,
      rewards: 0,
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
      title: "Thành công! 🎉",
      description: `Đã stake ${amount} CAN. Phần thưởng sẽ tích lũy theo thời gian!`,
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

    const apy = 15; // 15% APY for NFTs
    const lockedUntil = new Date();
    lockedUntil.setFullYear(lockedUntil.getFullYear() + 10);

    const { error } = await supabase.from("staking_nft").insert({
      user_id: session.user.id,
      nft_id: nft.id,
      nft_name: nft.name,
      nft_value: nft.value,
      rewards: 0,
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
      title: "Thành công! 🎉",
      description: `Đã stake NFT ${nft.name}. Phần thưởng sẽ tích lũy theo thời gian!`,
    });

    setSelectedNFT("");
    fetchStakes(session.user.id);
  };

  const calculateRewards = (stakeAmount: number, apy: number, stakedAt: string) => {
    const now = new Date();
    const stakeDate = new Date(stakedAt);
    const daysPassed = (now.getTime() - stakeDate.getTime()) / (1000 * 60 * 60 * 24);
    return (stakeAmount * apy * daysPassed) / (365 * 100);
  };

  const calculateDaysPassed = (stakedAt: string) => {
    const now = new Date();
    const stakeDate = new Date(stakedAt);
    return Math.floor((now.getTime() - stakeDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleClaim = async (stakeId: string, type: "coin" | "nft") => {
    if (!session) return;

    if (type === "coin") {
      const { data: stake } = await supabase
        .from("staking_coin")
        .select("*")
        .eq("id", stakeId)
        .single();

      if (!stake) return;

      const currentRewards = calculateRewards(stake.amount_staked, stake.apy, stake.staked_at);

      if (currentRewards < 0.01) {
        toast({
          title: "Chưa có phần thưởng",
          description: "Vui lòng đợi thêm thời gian để tích lũy phần thưởng",
          variant: "destructive",
        });
        return;
      }

      // Reset the staking time
      await supabase
        .from("staking_coin")
        .update({ 
          staked_at: new Date().toISOString(),
          rewards: 0
        })
        .eq("id", stakeId);

      // Add rewards to balance (not principal)
      await supabase
        .from("profiles")
        .update({ can_balance: (profile?.can_balance || 0) + currentRewards })
        .eq("id", session.user.id);

      toast({
        title: "Nhận thưởng thành công! 🎉",
        description: `Đã nhận ${currentRewards.toFixed(2)} CAN. Thời gian staking đã được reset và tiếp tục tích lũy.`,
      });

      fetchProfile(session.user.id);
      fetchStakes(session.user.id);
    } else {
      const { data: stake } = await supabase
        .from("staking_nft")
        .select("*")
        .eq("id", stakeId)
        .single();

      if (!stake) return;

      const currentRewards = calculateRewards(stake.nft_value, stake.apy, stake.staked_at);

      if (currentRewards < 0.01) {
        toast({
          title: "Chưa có phần thưởng",
          description: "Vui lòng đợi thêm thời gian để tích lũy phần thưởng",
          variant: "destructive",
        });
        return;
      }

      // Reset the staking time
      await supabase
        .from("staking_nft")
        .update({ 
          staked_at: new Date().toISOString(),
          rewards: 0
        })
        .eq("id", stakeId);

      // Add rewards to balance
      await supabase
        .from("profiles")
        .update({ can_balance: (profile?.can_balance || 0) + currentRewards })
        .eq("id", session.user.id);

      toast({
        title: "Nhận thưởng thành công! 🎉",
        description: `Đã nhận ${currentRewards.toFixed(2)} CAN. Thời gian staking đã được reset và tiếp tục tích lũy.`,
      });

      fetchProfile(session.user.id);
      fetchStakes(session.user.id);
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
    .reduce((sum, s) => sum + calculateRewards(s.amount_staked, s.apy, s.staked_at), 0);

  const totalNFTValue = nftStakes
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + s.nft_value, 0);
  
  const totalNFTRewards = nftStakes
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + calculateRewards(s.nft_value, s.apy, s.staked_at), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Staking Rewards Program</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Stake & Earn</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stake CAN token hoặc NFT để nhận phần thưởng liên tục. Nhận thưởng bất cứ lúc nào!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 hover-scale animate-fade-in">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Tổng CAN đã stake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold gradient-text">{totalCoinStaked.toLocaleString()}</span>
                <ArrowUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-500" />
                Phần thưởng CAN
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-green-500">{totalCoinRewards.toFixed(2)}</span>
                <Zap className="h-5 w-5 text-green-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Giá trị NFT stake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold gradient-text">{totalNFTValue.toLocaleString()}</span>
                <ArrowUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-500" />
                Phần thưởng NFT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-green-500">{totalNFTRewards.toFixed(2)}</span>
                <Zap className="h-5 w-5 text-green-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="coin" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="coin" className="text-lg">
              <Coins className="h-5 w-5 mr-2" />
              Staking CAN
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-lg">
              <Package className="h-5 w-5 mr-2" />
              Staking NFT
            </TabsTrigger>
          </TabsList>

          {/* CAN Staking */}
          <TabsContent value="coin" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Form with Hero Image */}
              <Card className="overflow-hidden border-primary/30 shadow-lg">
                <div className="relative h-48">
                  <img 
                    src={stakingCoinHero} 
                    alt="Staking CAN" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">Stake CAN Token</h3>
                    <p className="text-white/90">APY 10% - Nhận thưởng liên tục</p>
                  </div>
                </div>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Số dư khả dụng</span>
                      <span className="text-xl font-bold">{profile?.can_balance.toLocaleString() || 0} CAN</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Số lượng CAN muốn stake</label>
                    <Input
                      type="number"
                      placeholder="Nhập số lượng CAN"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>

                  {coinAmount && parseFloat(coinAmount) > 0 && (
                    <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Dự kiến phần thưởng</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">7 ngày</p>
                          <p className="text-sm font-bold text-green-500">
                            {((parseFloat(coinAmount) * 10 * 7) / (365 * 100)).toFixed(2)} CAN
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">30 ngày</p>
                          <p className="text-sm font-bold text-green-500">
                            {((parseFloat(coinAmount) * 10 * 30) / (365 * 100)).toFixed(2)} CAN
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">365 ngày</p>
                          <p className="text-sm font-bold text-green-500">
                            {((parseFloat(coinAmount) * 10) / 100).toFixed(2)} CAN
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button className="w-full h-12 text-lg" onClick={handleCoinStake}>
                    <Zap className="h-5 w-5 mr-2" />
                    Stake Ngay
                  </Button>
                </CardContent>
              </Card>

              {/* Active Stakes */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Lệnh Stake Đang Hoạt Động
                  </CardTitle>
                  <CardDescription>Phần thưởng đang tích lũy theo thời gian thực</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coinStakes.filter(s => s.status === "active").length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Chưa có lệnh stake nào</p>
                      <p className="text-sm text-muted-foreground mt-2">Bắt đầu stake để nhận phần thưởng!</p>
                    </div>
                  ) : (
                    coinStakes
                      .filter(s => s.status === "active")
                      .map((stake) => {
                        const daysPassed = calculateDaysPassed(stake.staked_at);
                        const currentRewards = calculateRewards(stake.amount_staked, stake.apy, stake.staked_at);

                        return (
                          <Card key={stake.id} className="border-primary/20 bg-gradient-to-br from-background to-primary/5 hover-scale">
                            <CardContent className="pt-6 space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-2xl font-bold gradient-text">
                                    {stake.amount_staked.toLocaleString()} CAN
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    APY: {stake.apy}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-green-500 flex items-center gap-1">
                                    <Sparkles className="h-4 w-4" />
                                    +{currentRewards.toFixed(2)} CAN
                                  </p>
                                  <p className="text-xs text-muted-foreground">Phần thưởng hiện tại</p>
                                </div>
                              </div>

                              <div className="p-3 bg-background/50 rounded-lg">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Đã stake
                                  </span>
                                  <span className="font-medium">{daysPassed} ngày</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Bắt đầu: {new Date(stake.staked_at).toLocaleDateString("vi-VN")}
                                </div>
                              </div>

                              <Button
                                className="w-full"
                                variant="default"
                                onClick={() => handleClaim(stake.id, "coin")}
                              >
                                <Gift className="h-4 w-4 mr-2" />
                                Nhận thưởng ({currentRewards.toFixed(2)} CAN)
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
          <TabsContent value="nft" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Form with Hero Image */}
              <Card className="overflow-hidden border-primary/30 shadow-lg">
                <div className="relative h-48">
                  <img 
                    src={stakingNftHero} 
                    alt="Staking NFT" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">Stake NFT</h3>
                    <p className="text-white/90">APY 15% - Phần thưởng cao hơn</p>
                  </div>
                </div>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Chọn NFT để stake</label>
                    <select
                      className="w-full p-3 border rounded-lg bg-background text-lg"
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

                  {selectedNFT && (
                    <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Dự kiến phần thưởng</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Giá trị NFT:</span>
                        <span className="font-bold">
                          {availableNFTs.find(n => n.id === selectedNFT)?.value.toLocaleString()} CAN
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">7 ngày</p>
                          <p className="text-sm font-bold text-green-500">
                            {(((availableNFTs.find(n => n.id === selectedNFT)?.value || 0) * 15 * 7) / (365 * 100)).toFixed(2)} CAN
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">30 ngày</p>
                          <p className="text-sm font-bold text-green-500">
                            {(((availableNFTs.find(n => n.id === selectedNFT)?.value || 0) * 15 * 30) / (365 * 100)).toFixed(2)} CAN
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">365 ngày</p>
                          <p className="text-sm font-bold text-green-500">
                            {(((availableNFTs.find(n => n.id === selectedNFT)?.value || 0) * 15) / 100).toFixed(2)} CAN
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button className="w-full h-12 text-lg" onClick={handleNFTStake} disabled={!selectedNFT}>
                    <Zap className="h-5 w-5 mr-2" />
                    Stake NFT Ngay
                  </Button>
                </CardContent>
              </Card>

              {/* Active Stakes */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    NFT Đang Stake
                  </CardTitle>
                  <CardDescription>Phần thưởng đang tích lũy theo thời gian thực</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nftStakes.filter(s => s.status === "active").length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Chưa có NFT stake nào</p>
                      <p className="text-sm text-muted-foreground mt-2">Stake NFT để nhận phần thưởng cao hơn!</p>
                    </div>
                  ) : (
                    nftStakes
                      .filter(s => s.status === "active")
                      .map((stake) => {
                        const daysPassed = calculateDaysPassed(stake.staked_at);
                        const currentRewards = calculateRewards(stake.nft_value, stake.apy, stake.staked_at);

                        return (
                          <Card key={stake.id} className="border-primary/20 bg-gradient-to-br from-background to-primary/5 hover-scale">
                            <CardContent className="pt-6 space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold text-lg">{stake.nft_name}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Giá trị: {stake.nft_value.toLocaleString()} CAN
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    APY: {stake.apy}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-green-500 flex items-center gap-1">
                                    <Sparkles className="h-4 w-4" />
                                    +{currentRewards.toFixed(2)} CAN
                                  </p>
                                  <p className="text-xs text-muted-foreground">Phần thưởng hiện tại</p>
                                </div>
                              </div>

                              <div className="p-3 bg-background/50 rounded-lg">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Đã stake
                                  </span>
                                  <span className="font-medium">{daysPassed} ngày</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Bắt đầu: {new Date(stake.staked_at).toLocaleDateString("vi-VN")}
                                </div>
                              </div>

                              <Button
                                className="w-full"
                                variant="default"
                                onClick={() => handleClaim(stake.id, "nft")}
                              >
                                <Gift className="h-4 w-4 mr-2" />
                                Nhận thưởng ({currentRewards.toFixed(2)} CAN)
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
        <Card className="mt-8 border-primary/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6" />
              Cách thức hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Staking CAN Token</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• APY cố định 10% mỗi năm</li>
                      <li>• Phần thưởng tích lũy theo thời gian thực</li>
                      <li>• Nhận thưởng bất cứ lúc nào bạn muốn</li>
                      <li>• Sau khi nhận thưởng, thời gian sẽ reset và tiếp tục tích lũy</li>
                      <li>• CAN stake vẫn giữ nguyên trong tài khoản</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Staking NFT</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• APY cao hơn 15% mỗi năm</li>
                      <li>• Phần thưởng tích lũy theo thời gian thực</li>
                      <li>• Nhận thưởng bằng CAN token</li>
                      <li>• Sau khi nhận thưởng, thời gian sẽ reset và tiếp tục tích lũy</li>
                      <li>• NFT vẫn thuộc sở hữu của bạn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Lưu ý quan trọng</p>
                  <p className="text-sm text-muted-foreground">
                    Phần thưởng được tính dựa trên thời gian stake thực tế. Bạn có thể nhận thưởng bất cứ lúc nào, 
                    sau đó thời gian sẽ được reset về 0 và tiếp tục tích lũy phần thưởng mới. Không có thời gian khóa tối thiểu!
                  </p>
                </div>
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