import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";
import nftBoxImage from "@/assets/nft-box.jpg";

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

export default function NFTDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock NFT data - in real app, fetch from API
  const nft = {
    id,
    name: "Cyber Punk #4231",
    image: nftBoxImage,
    price: "2.5 ETH",
    usdPrice: "$5,250",
    rarity: "Divine",
    type: "other",
    seller: "0x1234...5678",
    owner: "CryptoCollector",
    likes: 892,
    views: 3421,
    description:
      "Một tác phẩm nghệ thuật kỹ thuật số độc đáo, được tạo ra bởi nghệ sĩ nổi tiếng. NFT này mang phong cách Cyber Punk hiện đại với các chi tiết tinh tế và màu sắc sống động.",
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
        price: "2.5 ETH",
        from: "0x1234...5678",
        date: "2 giờ trước",
      },
      {
        event: "Sale",
        price: "2.2 ETH",
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
                  <div className="text-sm text-muted-foreground">Lượt thích</div>
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
                    className={rarityColors[nft.rarity as keyof typeof rarityColors]}
                  >
                    {nft.rarity}
                  </Badge>
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
                  <div className="text-xs text-muted-foreground">Chủ sở hữu</div>
                  <div className="font-semibold">{nft.owner}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Người bán</div>
                  <div className="font-mono text-sm">{nft.seller}</div>
                </div>
              </div>
            </div>

            {/* Price & Buy */}
            <div className="glass rounded-xl p-6">
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

              <div className="flex gap-3">
                <Button variant="gradient" size="lg" className="flex-1 gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Mua ngay
                </Button>
                <Button variant="outline" size="lg">
                  Đặt giá
                </Button>
              </div>
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
      </div>
    </div>
  );
}
