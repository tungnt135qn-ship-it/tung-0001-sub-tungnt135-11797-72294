import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { time: "00:00", transactions: 45, volume: 2300 },
  { time: "04:00", transactions: 32, volume: 1850 },
  { time: "08:00", transactions: 78, volume: 4200 },
  { time: "12:00", transactions: 125, volume: 6800 },
  { time: "16:00", transactions: 98, volume: 5400 },
  { time: "20:00", transactions: 156, volume: 8900 },
];

export const TransactionTrends = () => {
  return (
    <Card className="glass border-border/50 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Xu hướng giao dịch 24h
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <TrendingUp className="w-3 h-3" />
            <span>+23.5%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-muted/30 rounded-lg p-2">
            <div className="text-xs text-muted-foreground">Tổng giao dịch</div>
            <div className="text-lg font-bold text-primary">534</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <div className="text-xs text-muted-foreground">Khối lượng</div>
            <div className="text-lg font-bold text-secondary">29.5K CAN</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
