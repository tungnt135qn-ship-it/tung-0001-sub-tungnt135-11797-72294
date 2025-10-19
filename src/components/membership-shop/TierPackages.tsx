import { Button } from "@/components/ui/button";
import { Crown, Star, Zap, CheckCircle2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bronzeImg from "@/assets/tier-bronze.jpg";
import silverImg from "@/assets/tier-silver.jpg";
import goldImg from "@/assets/tier-gold.jpg";
import platinumImg from "@/assets/tier-platinum.jpg";

const tierPackages = [
  {
    id: "bronze",
    name: "Bronze",
    icon: Star,
    image: bronzeImg,
    color: "from-amber-700 to-amber-900",
    price: "50 CAN",
    usdPrice: "$10",
    buyers: 1247,
    nftDropRate: [
      { rarity: "Common", rate: "70%" },
      { rarity: "Rare", rate: "25%" },
      { rarity: "Epic", rate: "5%" },
    ],
    benefits: [
      "Phí giao dịch giảm 5%",
      "Truy cập NFT cơ bản",
      "1 nhiệm vụ/ngày",
    ],
    popular: false,
  },
  {
    id: "silver",
    name: "Silver",
    icon: Zap,
    image: silverImg,
    color: "from-gray-400 to-gray-600",
    price: "250 CAN",
    usdPrice: "$50",
    buyers: 856,
    nftDropRate: [
      { rarity: "Rare", rate: "50%" },
      { rarity: "Epic", rate: "40%" },
      { rarity: "Legendary", rate: "10%" },
    ],
    benefits: [
      "Phí giao dịch giảm 10%",
      "Truy cập NFT cao cấp",
      "3 nhiệm vụ/ngày",
      "Bonus staking +5%",
    ],
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    icon: Crown,
    image: goldImg,
    color: "from-yellow-400 to-yellow-600",
    price: "750 CAN",
    usdPrice: "$150",
    buyers: 423,
    nftDropRate: [
      { rarity: "Epic", rate: "50%" },
      { rarity: "Legendary", rate: "40%" },
      { rarity: "Mythic", rate: "10%" },
    ],
    benefits: [
      "Phí giao dịch giảm 15%",
      "Truy cập toàn bộ NFT",
      "5 nhiệm vụ/ngày",
      "Bonus staking +10%",
      "Airdrop độc quyền",
    ],
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: Crown,
    image: platinumImg,
    color: "from-cyan-400 to-purple-600",
    price: "2500 CAN",
    usdPrice: "$500",
    buyers: 127,
    nftDropRate: [
      { rarity: "Legendary", rate: "60%" },
      { rarity: "Mythic", rate: "30%" },
      { rarity: "Divine", rate: "10%" },
    ],
    benefits: [
      "Phí giao dịch MIỄN PHÍ",
      "NFT độc quyền",
      "Nhiệm vụ không giới hạn",
      "Bonus staking +20%",
      "Airdrop VIP",
    ],
    popular: false,
  },
];

export const TierPackages = () => {
  const navigate = useNavigate();

  // Tìm tier có nhiều người mua nhất
  const mostPopularTier = [...tierPackages].sort((a, b) => b.buyers - a.buyers)[0];
  const otherTiers = tierPackages.filter(t => t.id !== mostPopularTier.id);

  const handlePurchase = (e: React.MouseEvent, tierId: string) => {
    e.stopPropagation();
    // TODO: Implement purchase logic
    console.log("Purchase tier:", tierId);
  };

  const renderTierCard = (tier: typeof tierPackages[0], isFeatured = false) => {
    const Icon = tier.icon;
    return (
      <div
        key={tier.name}
        className={`glass rounded-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover-scale cursor-pointer flex flex-col ${
          isFeatured ? "pt-4 px-4 pb-4 border-2 border-primary h-[380px]" : "pt-3 px-3 pb-3 h-[340px]"
        }`}
        onClick={() => navigate(`/tier/${tier.id}`)}
      >
        {isFeatured && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-foreground px-3 py-1 rounded-bl-lg text-[10px] font-bold flex items-center gap-1 z-10">
            <Crown className="w-3 h-3" />
            PHỔ BIẾN NHẤT
          </div>
        )}

        {/* Header with image and price - Fixed height */}
        <div className={`flex gap-3 ${isFeatured ? 'mb-3 h-20' : 'mb-2 h-16'} flex-shrink-0`}>
          <img 
            src={tier.image} 
            alt={tier.name}
            className={`${isFeatured ? 'w-20 h-20' : 'w-14 h-14'} rounded-lg object-cover animate-scale-in flex-shrink-0`}
          />
          <div className="flex-1 min-w-0">
            <h3 className={`${isFeatured ? 'text-xl' : 'text-sm'} font-bold mb-0.5 truncate`}>{tier.name}</h3>
            <div className={`${isFeatured ? 'text-2xl' : 'text-base'} font-bold gradient-text truncate`}>{tier.price}</div>
            <div className={`${isFeatured ? 'text-xs' : 'text-[9px]'} text-muted-foreground truncate`}>{tier.usdPrice}</div>
          </div>
        </div>

        {/* NFT Drop Rates - Fixed height */}
        <div className={`bg-muted/20 rounded-lg ${isFeatured ? 'p-2 mb-2 h-[72px]' : 'p-1.5 mb-1.5 h-[60px]'} flex-shrink-0`}>
          <div className={`${isFeatured ? 'text-[10px]' : 'text-[9px]'} font-semibold text-muted-foreground mb-1 truncate`}>
            Tỉ lệ rơi NFT:
          </div>
          <div className={`flex gap-2 ${isFeatured ? 'text-xs' : 'text-[9px]'}`}>
            {tier.nftDropRate.map((drop) => (
              <div key={drop.rarity} className="flex-1 text-center min-w-0">
                <div className="text-foreground/70 truncate">{drop.rarity}</div>
                <div className="font-semibold text-primary truncate">{drop.rate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits - Compact list */}
        <div className={`${isFeatured ? 'mb-2' : 'mb-2'} flex-shrink-0`}>
          <div className={`space-y-${isFeatured ? '1.5' : '1'}`}>
            {tier.benefits.slice(0, isFeatured ? 4 : 3).map((benefit, i) => (
              <div key={i} className="flex items-start gap-1">
                <CheckCircle2 className={`${isFeatured ? 'w-3.5 h-3.5' : 'w-3 h-3'} text-primary flex-shrink-0 mt-0.5`} />
                <span className={`${isFeatured ? 'text-xs' : 'text-[10px]'} text-foreground/90 leading-tight line-clamp-1`}>{benefit}</span>
              </div>
            ))}
            {tier.benefits.length > (isFeatured ? 4 : 3) && (
              <div className={`${isFeatured ? 'text-xs' : 'text-[10px]'} text-muted-foreground text-center mt-1`}>
                +{tier.benefits.length - (isFeatured ? 4 : 3)} quyền lợi khác
              </div>
            )}
          </div>
        </div>

        {/* Buyers count - Fixed height */}
        <div className={`flex items-center justify-between ${isFeatured ? 'mb-2 h-5' : 'mb-2 h-5'} flex-shrink-0`}>
          <div className={`flex items-center gap-1 ${isFeatured ? 'text-xs' : 'text-[9px]'} text-muted-foreground`}>
            <Users className={`${isFeatured ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} />
            <span className="truncate">{tier.buyers.toLocaleString()} người mua</span>
          </div>
        </div>

        {/* Button - Fixed height */}
        <Button
          className={`w-full flex-shrink-0 ${isFeatured ? 'h-10 text-sm' : 'h-8 text-xs'}`}
          variant="gradient"
          onClick={(e) => handlePurchase(e, tier.id)}
        >
          Mua ngay
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Featured Popular Tier */}
      <div className="animate-scale-in">
        {renderTierCard(mostPopularTier, true)}
      </div>

      {/* Other Tiers */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Các hạng khác</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {otherTiers.map((tier, index) => (
            <div key={tier.id} style={{ animationDelay: `${index * 0.1}s` }}>
              {renderTierCard(tier, false)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
