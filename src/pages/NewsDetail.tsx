import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [news, setNews] = useState<NewsEvent | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (id) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header session={session} onSignOut={handleSignOut} />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background">
        <Header session={session} onSignOut={handleSignOut} />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy tin tức</p>
          <Button onClick={() => navigate("/")}>Quay lại</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          {news.image_url && (
            <div className="aspect-video w-full mb-8 rounded-xl overflow-hidden">
              <img 
                src={news.image_url} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                {news.event_type}
              </span>
              {news.event_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(news.event_date).toLocaleDateString("vi-VN")}
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4 gradient-text">{news.title}</h1>
          </div>

          <div className="glass rounded-xl p-8 mb-6">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{news.description}</p>
          </div>

          <div className="flex justify-between items-center glass rounded-xl p-4">
            <div className="text-sm text-muted-foreground">
              Ngày đăng: {new Date(news.created_at).toLocaleDateString("vi-VN")}
            </div>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
