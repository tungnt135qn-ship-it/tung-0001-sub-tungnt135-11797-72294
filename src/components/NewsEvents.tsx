import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import newsBanner from "@/assets/news-banner.jpg";

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string | null;
  is_featured: boolean;
  created_at: string;
}

export const NewsEvents = () => {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);

  useEffect(() => {
    const fetchNewsEvents = async () => {
      const { data } = await supabase
        .from("news_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        setNewsEvents(data);
      }
    };

    fetchNewsEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("news_events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news_events",
        },
        () => {
          fetchNewsEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "news":
        return "bg-primary/20 text-primary";
      case "event":
        return "bg-secondary/20 text-secondary";
      case "announcement":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted";
    }
  };

  return (
    <section className="py-16 relative">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${newsBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Tin tức & Sự kiện
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về CryptoHub và CAN token
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsEvents.map((item) => (
            <Card
              key={item.id}
              className={`glass hover:scale-105 transition-all ${
                item.is_featured ? "border-primary/60" : "border-border/30"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getEventTypeColor(item.event_type)}>
                    {item.event_type === "news" && "Tin tức"}
                    {item.event_type === "event" && "Sự kiện"}
                    {item.event_type === "announcement" && "Thông báo"}
                  </Badge>
                  {item.is_featured && (
                    <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {item.description}
                </CardDescription>
                {item.event_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(item.event_date), "dd MMM yyyy", { locale: vi })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
