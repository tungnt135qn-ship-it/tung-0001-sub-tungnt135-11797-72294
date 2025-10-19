import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Gift, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface HistoryItem {
  id: string;
  user: string;
  tier: string;
  nftReceived: string;
  rarity: string;
  timestamp: Date;
  color: string;
}

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Epic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Legendary: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Mythic: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Divine: "bg-red-500/20 text-red-300 border-red-500/30",
};

const initialHistory: HistoryItem[] = [
  {
    id: "1",
    user: "0x7a9f...3d2c",
    tier: "Platinum",
    nftReceived: "Divine Dragon #001",
    rarity: "Divine",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    color: "from-cyan-400 to-purple-600",
  },
  {
    id: "2",
    user: "0x4b8c...9e1f",
    tier: "Gold",
    nftReceived: "Legendary Phoenix #234",
    rarity: "Legendary",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "3",
    user: "0x2f5d...7a8b",
    tier: "Silver",
    nftReceived: "Epic Warrior #567",
    rarity: "Epic",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "4",
    user: "0x9c3e...5f2a",
    tier: "Gold",
    nftReceived: "Mythic Unicorn #089",
    rarity: "Mythic",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "5",
    user: "0x1a7b...4d9c",
    tier: "Bronze",
    nftReceived: "Rare Knight #891",
    rarity: "Rare",
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    color: "from-amber-700 to-amber-900",
  },
  {
    id: "6",
    user: "0x8d2f...6c3e",
    tier: "Platinum",
    nftReceived: "Mythic Angel #345",
    rarity: "Mythic",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    color: "from-cyan-400 to-purple-600",
  },
  {
    id: "7",
    user: "0x5e9a...2b7f",
    tier: "Silver",
    nftReceived: "Rare Mage #678",
    rarity: "Rare",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    color: "from-gray-400 to-gray-600",
  },
];

export const RealtimeHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomTiers = ["Bronze", "Silver", "Gold", "Platinum"];
      const randomRarities = ["Rare", "Epic", "Legendary", "Mythic", "Divine"];
      const randomNFTs = ["Dragon", "Phoenix", "Warrior", "Unicorn", "Knight", "Angel", "Mage"];
      const tierColors: Record<string, string> = {
        Bronze: "from-amber-700 to-amber-900",
        Silver: "from-gray-400 to-gray-600",
        Gold: "from-yellow-400 to-yellow-600",
        Platinum: "from-cyan-400 to-purple-600",
      };

      const tier = randomTiers[Math.floor(Math.random() * randomTiers.length)];
      const rarity = randomRarities[Math.floor(Math.random() * randomRarities.length)];
      const nft = randomNFTs[Math.floor(Math.random() * randomNFTs.length)];

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        user: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        tier,
        nftReceived: `${rarity} ${nft} #${Math.floor(Math.random() * 1000)}`,
        rarity,
        timestamp: new Date(),
        color: tierColors[tier],
      };

      setHistory((prev) => [newItem, ...prev].slice(0, 7));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg gradient-text flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Lịch sử mua gần đây
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="p-3 bg-background/50 rounded-lg border border-border/30 hover:border-primary/30 transition-all animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-muted-foreground mb-1">
                  {item.user}
                </div>
                <div className="text-xs text-foreground/90 mb-1">
                  Mua gói <span className="font-semibold">{item.tier}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-10">
              <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">
                  {item.nftReceived}
                </div>
              </div>
              <Badge className={`text-xs border ${rarityColors[item.rarity as keyof typeof rarityColors]}`}>
                {item.rarity}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground mt-2 ml-10">
              {formatDistanceToNow(item.timestamp, {
                addSuffix: true,
                locale: vi,
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
