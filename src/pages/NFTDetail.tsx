import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  TrendingUp,
  Clock,
  User,
  ShoppingBag,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import nftBoxImage from "@/assets/nft-box.jpg";

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

// Financial data for other NFTs
const revenueData = [
  { month: "T1", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "T2", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "T3", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "T4", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "T5", revenue: 58000, expenses: 36000, profit: 22000 },
  { month: "T6", revenue: 67000, expenses: 40000, profit: 27000 },
];

const performanceData = [
  { month: "T1", roi: 12.5 },
  { month: "T2", roi: 15.8 },
  { month: "T3", roi: 14.2 },
  { month: "T4", roi: 18.9 },
  { month: "T5", roi: 17.6 },
  { month: "T6", roi: 21.3 },
];

export default function NFTDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Check if it's an "other" type NFT (id >= 5)
  const isOtherNFT = parseInt(id || "0") >= 5;

  // Mock NFT data - in real app, fetch from API
  const nft = {
    id,
    name: isOtherNFT ? "Cyber Punk #4231" : "Gold Tier NFT #1523",
    image: nftBoxImage,
    price: isOtherNFT ? "2.5 ETH" : "0.8 ETH",
    usdPrice: isOtherNFT ? "$5,250" : "$1,680",
    rarity: isOtherNFT ? "Divine" : "Legendary",
    type: isOtherNFT ? "other" : "tier",
    seller: "0x1234...5678",
    owner: "CryptoCollector",
    likes: 892,
    views: 3421,
    description: isOtherNFT
      ? "Một tác phẩm nghệ thuật kỹ thuật số độc đáo, được tạo ra bởi nghệ sĩ nổi tiếng. NFT này mang phong cách Cyber Punk hiện đại với các chi tiết tinh tế và màu sắc sống động."
      : "NFT hạng Gold mang đến đặc quyền cao cấp trong hệ sinh thái. Được bán một lần cho toàn bộ NFT hạng này với quyền lợi và lợi ích đặc biệt.",
    // For other NFTs
    totalValue: "250 ETH",
    pricePerShare: "2.5 ETH",
    sharesSold: 67,
    totalShares: 100,
    purchases: 892,
    attributes: [
      { trait: "Background", value: "Neon City", rarity: "15%" },
      { trait: "Character", value: "Warrior", rarity: "8%" },
      { trait: "Outfit", value: "Cyber Suit", rarity: "12%" },
      { trait: "Weapon", value: "Laser Blade", rarity: "5%" },
      { trait: "Accessory", value: "VR Visor", rarity: "20%" },
    ],
    history: [
      {
        event: "Listed",
        price: isOtherNFT ? "2.5 ETH" : "0.8 ETH",
        from: "0x1234...5678",
        date: "2 giờ trước",
      },
      {
        event: "Sale",
        price: isOtherNFT ? "2.2 ETH" : "0.75 ETH",
        from: "0xabcd...efgh",
        to: "0x1234...5678",
        date: "1 ngày trước",
      },
      {
        event: "Minted",
        price: "-",
        from: "Creator",
        date: "7 ngày trước",
      },
    ],
  };

  const progressPercentage =
    (nft.sharesSold / nft.totalShares) * 100;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/nft-market")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="glass rounded-2xl overflow-hidden">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {isOtherNFT ? "Lượt mua" : "Lượt thích"}
                  </div>
                  <div className="font-bold">{nft.likes}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Lượt xem</div>
                  <div className="font-bold">{nft.views}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Title & Actions */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
                  <Badge
                    className={
                      rarityColors[nft.rarity as keyof typeof rarityColors]
                    }
                  >
                    {nft.rarity}
                  </Badge>
                  {!isOtherNFT && (
                    <Badge className="ml-2 bg-primary/20 text-primary">
                      Bán 1 lần
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground">{nft.description}</p>
            </div>

            {/* Owner & Seller */}
            <div className="glass rounded-xl p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Chủ sở hữu
                  </div>
                  <div className="font-semibold">{nft.owner}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Người bán
                  </div>
                  <div className="font-mono text-sm">{nft.seller}</div>
                </div>
              </div>
            </div>

            {/* Price & Buy */}
            <div className="glass rounded-xl p-6">
              {isOtherNFT ? (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giá trị tổng
                      </span>
                      <span className="text-xl font-bold gradient-text">
                        {nft.totalValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giá/cổ phần
                      </span>
                      <span className="text-lg font-semibold">
                        {nft.pricePerShare}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Tiến trình bán</span>
                        <span>
                          {nft.sharesSold}/{nft.totalShares} cổ phần
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <div className="text-sm text-primary font-semibold">
                        {progressPercentage.toFixed(1)}% đã bán
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="flex-1 gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Mua cổ phần
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Giá hiện tại
                    </div>
                    <div className="flex items-baseline gap-3">
                      <div className="text-4xl font-bold gradient-text">
                        {nft.price}
                      </div>
                      <div className="text-xl text-muted-foreground">
                        {nft.usdPrice}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💎 NFT hạng này được bán một lần cho toàn bộ quyền sở hữu
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="flex-1 gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Mua ngay
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Attributes */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Thuộc tính</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr) => (
                  <div
                    key={attr.trait}
                    className="bg-muted/20 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {attr.trait}
                    </div>
                    <div className="font-semibold">{attr.value}</div>
                    <div className="text-xs text-primary mt-1">
                      {attr.rarity} độ hiếm
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Lịch sử giao dịch</h3>
              <div className="space-y-3">
                {nft.history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{item.event}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.from}
                          {item.to && ` → ${item.to}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.price}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Reports - Only for Other NFTs */}
        {isOtherNFT && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              Báo cáo tài chính
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Key Metrics */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Doanh thu TB/tháng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    $56.8K
                  </div>
                  <div className="text-sm text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    +18.5% so với tháng trước
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    ROI TB
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    16.7%
                  </div>
                  <div className="text-sm text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    +2.3% so với kỳ trước
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-primary" />
                    Chi phí TB/tháng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    $35.7K
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Ổn định trong 6 tháng
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>Doanh thu & Lợi nhuận (6 tháng gần nhất)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--primary))"
                      name="Doanh thu"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="hsl(var(--muted))"
                      name="Chi phí"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="profit"
                      fill="hsl(var(--chart-2))"
                      name="Lợi nhuận"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Hiệu suất ROI theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="ROI (%)"
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="glass rounded-xl p-6 mt-6">
              <h3 className="text-xl font-bold mb-6">
                Dòng thời gian tài chính
              </h3>
              <div className="space-y-4">
                {[
                  {
                    month: "Tháng 6/2025",
                    event: "Doanh thu kỷ lục",
                    detail: "$67K doanh thu, ROI 21.3%",
                    positive: true,
                  },
                  {
                    month: "Tháng 5/2025",
                    event: "Tăng trưởng ổn định",
                    detail: "$58K doanh thu, ROI 17.6%",
                    positive: true,
                  },
                  {
                    month: "Tháng 4/2025",
                    event: "Bùng nổ lợi nhuận",
                    detail: "$61K doanh thu, ROI 18.9%",
                    positive: true,
                  },
                  {
                    month: "Tháng 3/2025",
                    event: "Tăng trưởng đều",
                    detail: "$48K doanh thu, ROI 14.2%",
                    positive: true,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.positive
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {item.positive ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">
                        {item.month}
                      </div>
                      <div className="font-semibold mb-1">{item.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
