import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_type: string;
  event_date: string | null;
  created_at: string;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  is_featured: boolean;
}

export default function NewsList() {
  const [session, setSession] = useState<Session | null>(null);
  const [allNews, setAllNews] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllNews(data || []);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByType = (type: string) => {
    return allNews.filter(item => item.event_type === type);
  };

  const getEventStatus = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return null;
    
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "ended";
  };

  const NewsCard = ({ item }: { item: NewsEvent }) => {
    const eventStatus = item.event_type === "event" ? getEventStatus(item.start_time, item.end_time) : null;

    return (
      <Card
        className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        onClick={() => navigate(`/news/${item.id}`)}
      >
        {item.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {item.is_featured && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary">
                Nổi bật
              </Badge>
            )}
            {eventStatus && (
              <Badge 
                className="absolute top-4 left-4"
                variant={eventStatus === "upcoming" ? "outline" : eventStatus === "ongoing" ? "default" : "secondary"}
              >
                {eventStatus === "upcoming" ? "Sắp diễn ra" : eventStatus === "ongoing" ? "Đang diễn ra" : "Đã kết thúc"}
              </Badge>
            )}
          </div>
        )}
        <div className="p-6">
          <Badge variant={item.event_type === "event" ? "default" : "secondary"} className="mb-3">
            {item.event_type === "news" ? "Tin tức" : item.event_type === "notification" ? "Thông báo" : "Sự kiện"}
          </Badge>
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
            </div>
            {item.event_type === "event" && item.start_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(item.start_time).toLocaleString("vi-VN", { 
                  day: "2-digit", 
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit"
                })}</span>
              </div>
            )}
            {item.event_type === "event" && item.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{item.location}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} onSignOut={() => setSession(null)} />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Tin tức & Sự kiện
          </h1>
          <p className="text-xl text-muted-foreground">
            Cập nhật tin tức mới nhất và các sự kiện sắp tới
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
            <TabsTrigger value="notification">Thông báo</TabsTrigger>
            <TabsTrigger value="event">Sự kiện</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("news").map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notification" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("notification").map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="event" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("event").map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {allNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Chưa có tin tức nào</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}