import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { NFTMarketHeader } from "@/components/nft/NFTMarketHeader";
import { NFTFilters, NFTFiltersState } from "@/components/nft/NFTFilters";
import { NFTGrid } from "@/components/nft/NFTGrid";
import { NFT } from "@/components/nft/NFTCard";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import nftBoxImage from "@/assets/nft-box.jpg";
import tierGoldImage from "@/assets/tier-gold.jpg";
import tierPlatinumImage from "@/assets/tier-platinum.jpg";
import tierSilverImage from "@/assets/tier-silver.jpg";
import tierBronzeImage from "@/assets/tier-bronze.jpg";

// Sample NFT data
const sampleNFTs: NFT[] = [
  // Tier NFTs
  {
    id: "1",
    name: "Gold Tier NFT #1523",
    image: tierGoldImage,
    price: "0.8 ETH",
    rarity: "Legendary",
    type: "tier",
    seller: "0x7a9f...3d2c",
  },
  {
    id: "2",
    name: "Platinum Tier NFT #0892",
    image: tierPlatinumImage,
    price: "3.2 ETH",
    rarity: "Mythic",
    type: "tier",
    seller: "0x4b8c...9e1f",
  },
  {
    id: "3",
    name: "Silver Tier NFT #2341",
    image: tierSilverImage,
    price: "0.28 ETH",
    rarity: "Epic",
    type: "tier",
    seller: "0x2f5d...7a8b",
  },
  {
    id: "4",
    name: "Bronze Tier NFT #4567",
    image: tierBronzeImage,
    price: "0.1 ETH",
    rarity: "Rare",
    type: "tier",
    seller: "0x8c3d...4f2a",
  },
  // Other NFTs
  {
    id: "5",
    name: "Cyber Punk #4231",
    image: nftBoxImage,
    price: "2.5 ETH",
    rarity: "Divine",
    type: "other",
    seller: "0x1234...5678",
    totalValue: "250 ETH",
    pricePerShare: "2.5 ETH",
    sharesSold: 67,
    totalShares: 100,
    purchases: 892,
  },
  {
    id: "6",
    name: "Digital Warrior #892",
    image: nftBoxImage,
    price: "1.8 ETH",
    rarity: "Legendary",
    type: "other",
    seller: "0xabcd...efgh",
    totalValue: "180 ETH",
    pricePerShare: "1.8 ETH",
    sharesSold: 45,
    totalShares: 100,
    purchases: 456,
  },
  {
    id: "7",
    name: "Future Vision #156",
    image: nftBoxImage,
    price: "3.2 ETH",
    rarity: "Mythic",
    type: "other",
    seller: "0x9876...5432",
    totalValue: "320 ETH",
    pricePerShare: "3.2 ETH",
    sharesSold: 82,
    totalShares: 100,
    purchases: 678,
  },
  {
    id: "8",
    name: "Neon Dream #789",
    image: nftBoxImage,
    price: "1.2 ETH",
    rarity: "Epic",
    type: "other",
    seller: "0x3456...7890",
    totalValue: "120 ETH",
    pricePerShare: "1.2 ETH",
    sharesSold: 23,
    totalShares: 100,
    purchases: 234,
  },
  {
    id: "9",
    name: "Quantum Blast #345",
    image: nftBoxImage,
    price: "0.9 ETH",
    rarity: "Rare",
    type: "other",
    seller: "0x5678...9012",
    totalValue: "90 ETH",
    pricePerShare: "0.9 ETH",
    sharesSold: 15,
    totalShares: 100,
    purchases: 167,
  },
  {
    id: "10",
    name: "Cosmic Ray #901",
    image: nftBoxImage,
    price: "0.5 ETH",
    rarity: "Common",
    type: "other",
    seller: "0x7890...1234",
    totalValue: "50 ETH",
    pricePerShare: "0.5 ETH",
    sharesSold: 8,
    totalShares: 100,
    purchases: 98,
  },
];

export default function NFTMarket() {
  const [session, setSession] = useState<Session | null>(null);
  const [filters, setFilters] = useState<NFTFiltersState>({
    rarity: [],
    priceRange: [0, 10],
    type: "all",
  });

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

  const filteredNFTs = useMemo(() => {
    return sampleNFTs.filter((nft) => {
      // Type filter
      if (filters.type !== "all" && nft.type !== filters.type) {
        return false;
      }

      // Rarity filter
      if (filters.rarity.length > 0 && !filters.rarity.includes(nft.rarity)) {
        return false;
      }

      // Price range filter
      const priceValue = parseFloat(nft.price.split(" ")[0]);
      if (
        priceValue < filters.priceRange[0] ||
        priceValue > filters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const tierNFTs = filteredNFTs.filter((nft) => nft.type === "tier");
  const otherNFTs = filteredNFTs.filter((nft) => nft.type === "other");

  return (
    <>
      <Header session={session} onSignOut={() => setSession(null)} />
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <NFTMarketHeader />
          
          <NFTFilters filters={filters} onFiltersChange={setFilters} />

          {filters.type !== "other" && tierNFTs.length > 0 && (
            <NFTGrid nfts={tierNFTs} title="NFT Hạng" initialCount={3} />
          )}

          {filters.type !== "tier" && otherNFTs.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 gradient-text">NFT Khác</h2>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Đang bán</h3>
                <NFTGrid nfts={otherNFTs} title="" initialCount={6} />
              </div>
            </>
          )}

          {filteredNFTs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                Không tìm thấy NFT phù hợp với bộ lọc
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

