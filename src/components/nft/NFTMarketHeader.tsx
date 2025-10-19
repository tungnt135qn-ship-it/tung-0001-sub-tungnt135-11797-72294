import { TrendingUp, Users, DollarSign, Package } from "lucide-react";
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const volumeData = [
  { name: "T1", value: 4.2 },
  { name: "T2", value: 5.8 },
  { name: "T3", value: 6.5 },
  { name: "T4", value: 7.2 },
  { name: "T5", value: 8.5 },
  { name: "T6", value: 9.1 },
];

const priceData = [
  { name: "T1", value: 0.65 },
  { name: "T2", value: 0.72 },
  { name: "T3", value: 0.68 },
  { name: "T4", value: 0.78 },
  { name: "T5", value: 0.82 },
  { name: "T6", value: 0.85 },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        {/* Volume Chart */}
        <Card className="glass col-span-1 md:col-span-1 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-semibold text-green-500">
                +15.7%
              </div>
            </div>
            <CardTitle className="text-lg">Khối lượng giao dịch</CardTitle>
            <div className="text-2xl font-bold gradient-text">$8.5M</div>
          </CardHeader>
          <CardContent className="pb-2">
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={volumeData}>
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card className="glass col-span-1 md:col-span-1 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-semibold text-green-500">
                +5.2%
              </div>
            </div>
            <CardTitle className="text-lg">Giá sàn TB</CardTitle>
            <div className="text-2xl font-bold gradient-text">0.85 ETH</div>
          </CardHeader>
          <CardContent className="pb-2">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={priceData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
