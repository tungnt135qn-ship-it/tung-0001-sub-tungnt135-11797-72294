import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Video, Users, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  event_type: string;
  event_date: string | null;
  created_at: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  zoom_link: string | null;
  start_time: string | null;
  end_time: string | null;
  max_attendees: number | null;
}

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsEvent | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [eventStatus, setEventStatus] = useState<"upcoming" | "ongoing" | "ended">("upcoming");

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
  }, [id, session]);

  useEffect(() => {
    if (news?.event_type === "event" && news.start_time && news.end_time) {
      updateEventStatus();
      const interval = setInterval(() => {
        updateEventStatus();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [news]);

  const updateEventStatus = () => {
    if (!news?.start_time || !news?.end_time) return;

    const now = new Date().getTime();
    const start = new Date(news.start_time).getTime();
    const end = new Date(news.end_time).getTime();

    if (now < start) {
      setEventStatus("upcoming");
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`);
    } else if (now >= start && now <= end) {
      setEventStatus("ongoing");
      const diff = end - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`Còn ${hours} giờ ${minutes} phút`);
    } else {
      setEventStatus("ended");
      setTimeRemaining("Sự kiện đã kết thúc");
    }
  };

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setNews(data);

      if (data.event_type === "event" && session) {
        const { data: regData } = await supabase
          .from("event_registrations")
          .select("*")
          .eq("event_id", id)
          .eq("user_id", session.user.id)
          .single();

        setIsRegistered(!!regData);

        const { count } = await supabase
          .from("event_registrations")
          .select("*", { count: "exact", head: true })
          .eq("event_id", id);

        setRegistrationCount(count || 0);
      }
    } catch (error) {
      console.error("Error loading news:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải tin tức",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!session) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đăng ký sự kiện",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (news?.max_attendees && registrationCount >= news.max_attendees) {
      toast({
        title: "Sự kiện đã đầy",
        description: "Sự kiện đã đạt số lượng người tham gia tối đa",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isRegistered) {
        await supabase
          .from("event_registrations")
          .delete()
          .eq("event_id", id)
          .eq("user_id", session.user.id);

        setIsRegistered(false);
        setRegistrationCount(prev => prev - 1);
        toast({
          title: "Hủy đăng ký thành công",
          description: "Bạn đã hủy đăng ký tham gia sự kiện",
        });
      } else {
        await supabase.from("event_registrations").insert({
          event_id: id,
          user_id: session.user.id,
        });

        setIsRegistered(true);
        setRegistrationCount(prev => prev + 1);
        toast({
          title: "Đăng ký thành công",
          description: "Bạn đã đăng ký tham gia sự kiện thành công",
        });
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng ký sự kiện",
        variant: "destructive",
      });
    }
  };

  const openMaps = () => {
    if (news?.latitude && news?.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${news.latitude},${news.longitude}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header session={session} onSignOut={() => setSession(null)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy tin tức</h1>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} onSignOut={() => setSession(null)} />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge variant={news.event_type === "event" ? "default" : "secondary"} className="mb-4">
              {news.event_type === "news" ? "Tin tức" : news.event_type === "notification" ? "Thông báo" : "Sự kiện"}
            </Badge>
            {news.event_type === "event" && (
              <Badge 
                variant={eventStatus === "upcoming" ? "outline" : eventStatus === "ongoing" ? "default" : "secondary"}
                className="ml-2"
              >
                {eventStatus === "upcoming" ? "Sắp diễn ra" : eventStatus === "ongoing" ? "Đang diễn ra" : "Đã kết thúc"}
              </Badge>
            )}
            <h1 className="text-4xl font-bold gradient-text mb-4">{news.title}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(news.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
              {news.event_type === "event" && news.start_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(news.start_time).toLocaleString("vi-VN")}</span>
                </div>
              )}
              {news.event_type === "event" && news.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{news.location}</span>
                </div>
              )}
            </div>
          </div>

          {news.image_url && (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}

          {news.event_type === "event" && eventStatus === "upcoming" && timeRemaining && (
            <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Thời gian bắt đầu</h3>
                <p className="text-3xl font-bold gradient-text">{timeRemaining}</p>
              </div>
            </Card>
          )}

          {news.event_type === "event" && eventStatus === "ongoing" && (
            <Card className="p-6 mb-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-xl font-bold">Sự kiện đang diễn ra</h3>
                  <p className="text-muted-foreground">{timeRemaining}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-muted-foreground mb-4">{news.description}</p>
            {news.content && (
              <div className="whitespace-pre-wrap">{news.content}</div>
            )}
          </div>

          {news.event_type === "event" && (
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {registrationCount} người đã đăng ký
                    {news.max_attendees && ` / ${news.max_attendees}`}
                  </span>
                </div>
              </div>

              {eventStatus !== "ended" && (
                <div className="space-y-4">
                  {eventStatus === "upcoming" && (
                    <Button
                      onClick={handleRegister}
                      className="w-full"
                      variant={isRegistered ? "outline" : "gradient"}
                      disabled={!isRegistered && news.max_attendees ? registrationCount >= news.max_attendees : false}
                    >
                      {isRegistered ? "Hủy đăng ký" : news.max_attendees && registrationCount >= news.max_attendees ? "Đã đầy" : "Đăng ký tham gia"}
                    </Button>
                  )}

                  {news.zoom_link && (
                    <Button
                      onClick={() => window.open(news.zoom_link!, "_blank")}
                      className="w-full"
                      variant={eventStatus === "ongoing" ? "gradient" : "outline"}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {eventStatus === "ongoing" ? "Tham gia online ngay" : "Link Zoom"}
                    </Button>
                  )}

                  {news.latitude && news.longitude && (
                    <Button
                      onClick={openMaps}
                      className="w-full"
                      variant="outline"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {eventStatus === "ongoing" ? "Xem chỉ đường" : "Xem vị trí"}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}