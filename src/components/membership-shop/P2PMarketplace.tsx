import { Button } from "@/components/ui/button";
import { Store, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const p2pListings = [
  {
    id: 1,
    tier: "Gold",
    nftName: "Gold Tier NFT #1523",
    rarity: "Legendary",
    seller: "0x7a9f...3d2c",
    price: "800 CAN",
    usdPrice: "$160",
    listedTime: "2 giờ trước",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: 2,
    tier: "Platinum",
    nftName: "Platinum Tier NFT #0892",
    rarity: "Mythic",
    seller: "0x4b8c...9e1f",
    price: "3200 CAN",
    usdPrice: "$640",
    listedTime: "5 giờ trước",
    color: "from-cyan-400 to-purple-600",
  },
  {
    id: 3,
    tier: "Silver",
    nftName: "Silver Tier NFT #2341",
    rarity: "Epic",
    seller: "0x2f5d...7a8b",
    price: "280 CAN",
    usdPrice: "$56",
    listedTime: "1 ngày trước",
    color: "from-gray-400 to-gray-600",
  },
];

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

export const P2PMarketplace = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Store className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">Thị trường P2P</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          {p2pListings.length} NFT đang bán
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {p2pListings.map((listing) => (
          <div
            key={listing.id}
            className="glass rounded-xl p-4 hover:scale-[1.01] transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* NFT Icon */}
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${listing.color} flex items-center justify-center flex-shrink-0`}>
                  <div className="text-white text-xs font-bold text-center">
                    {listing.tier}
                  </div>
                </div>

                {/* NFT Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{listing.nftName}</h3>
                    <Badge className={`text-xs ${rarityColors[listing.rarity as keyof typeof rarityColors]}`}>
                      {listing.rarity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <span>Người bán:</span>
                      <span className="font-mono">{listing.seller}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{listing.listedTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-primary">{listing.price}</div>
                    <div className="text-xs text-muted-foreground">≈ {listing.usdPrice}</div>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <Button variant="gradient" size="sm" className="flex-shrink-0">
                Mua ngay
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        Xem tất cả NFT đang bán
      </Button>
    </div>
  );
};
