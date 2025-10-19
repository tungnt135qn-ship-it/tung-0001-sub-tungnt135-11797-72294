import { TrendingUp, Users, DollarSign, Package } from "lucide-react";

export const NFTMarketHeader = () => {
  const stats = [
    {
      icon: Package,
      label: "Tổng NFT",
      value: "15,234",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      icon: Users,
      label: "Người dùng hoạt động",
      value: "2,456",
      trend: "+8.3%",
      trendUp: true,
    },
    {
      icon: DollarSign,
      label: "Khối lượng giao dịch",
      value: "$8.5M",
      trend: "+15.7%",
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: "Giá sàn trung bình",
      value: "0.85 ETH",
      trend: "+5.2%",
      trendUp: true,
    },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">NFT Marketplace</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Khám phá, mua bán và sở hữu các NFT độc quyền
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-6 hover:scale-105 transition-all animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div
                className={`text-sm font-semibold ${
                  stat.trendUp ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend}
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
