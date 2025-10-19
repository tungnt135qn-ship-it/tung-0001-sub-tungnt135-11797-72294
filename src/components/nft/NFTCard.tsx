import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Heart } from "lucide-react";

export interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  rarity: string;
  type: "tier" | "other";
  seller?: string;
  likes?: number;
}

interface NFTCardProps {
  nft: NFT;
}

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

export const NFTCard = ({ nft }: NFTCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass rounded-xl overflow-hidden hover:scale-105 transition-all group cursor-pointer">
      {/* Image */}
      <div 
        className="relative h-64 overflow-hidden"
        onClick={() => navigate(`/nft/${nft.id}`)}
      >
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        
        {/* Rarity Badge */}
        <Badge
          className={`absolute top-4 right-4 ${
            rarityColors[nft.rarity as keyof typeof rarityColors]
          }`}
        >
          {nft.rarity}
        </Badge>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate">{nft.name}</h3>

        {nft.seller && (
          <div className="text-xs text-muted-foreground mb-3">
            Người bán:{" "}
            <span className="font-mono text-foreground">{nft.seller}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Giá</div>
            <div className="text-xl font-bold text-primary">{nft.price}</div>
          </div>
          {nft.likes !== undefined && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Lượt thích</div>
              <div className="text-sm font-semibold">{nft.likes}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="gradient"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              // Handle buy action
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Mua ngay
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/nft/${nft.id}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
