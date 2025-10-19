import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  price_per_token: number;
  total_value: number;
  phase: number;
  status: string;
  created_at: string;
}

interface LiveTransactionFeedProps {
  phaseId?: number;
  limit?: number;
}

export const LiveTransactionFeed = ({ phaseId, limit = 5 }: LiveTransactionFeedProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (phaseId) {
        query = query.eq("phase", phaseId);
      }

      const { data, error } = await query;

      if (data && !error) {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("live_transactions")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
        },
        (payload) => {
          const newTx = payload.new as Transaction;
          if (!phaseId || newTx.phase === phaseId) {
            setTransactions((prev) => [newTx, ...prev].slice(0, limit));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [phaseId, limit]);

  const getRandomUserName = () => {
    const names = ["Minh", "Hương", "Tuấn", "Linh", "Nam", "Trang", "Khoa", "Thu", "Đạt", "Hà"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Card className="glass border-primary/30">
        <CardContent className="py-8 text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <span className="gradient-text">Giao dịch realtime</span>
          <Badge variant="secondary" className="ml-auto animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Chưa có giao dịch nào
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {transactions.map((tx, index) => {
              const userName = getRandomUserName();
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all animate-fade-in border border-primary/10"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate">
                        {userName}***
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Phase {tx.phase}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Đã mua {tx.amount.toLocaleString()} CAN
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-400 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-sm">${tx.total_value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(tx.created_at), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
