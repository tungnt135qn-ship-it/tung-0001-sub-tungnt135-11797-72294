import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Users, 
  Globe, 
  TrendingUp, 
  Shield, 
  Zap,
  Mail,
  Phone,
  MapPin,
  Send,
  Rocket,
  Award,
  Building2
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const AboutUs = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Đã gửi thành công",
      description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const leaders = [
    {
      name: "Nguyễn Văn A",
      position: "CEO & Founder",
      description: "15+ năm kinh nghiệm trong lĩnh vực blockchain và fintech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
    },
    {
      name: "Trần Thị B",
      position: "CTO",
      description: "Chuyên gia công nghệ blockchain với nhiều dự án thành công",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
    },
    {
      name: "Lê Văn C",
      position: "CFO",
      description: "Chuyên gia tài chính với kinh nghiệm tại các tập đoàn lớn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3"
    },
    {
      name: "Phạm Thị D",
      position: "CMO",
      description: "Chuyên gia marketing với track record ấn tượng",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4"
    }
  ];

  const partners = [
    { name: "Binance", type: "Exchange Partner" },
    { name: "Coinbase", type: "Investment Partner" },
    { name: "Polygon", type: "Technology Partner" },
    { name: "Chainlink", type: "Oracle Partner" },
    { name: "Uniswap", type: "DeFi Partner" },
    { name: "AAVE", type: "Lending Partner" }
  ];

  const ecosystem = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "DeFi Platform",
      description: "Nền tảng tài chính phi tập trung với APY cao"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "NFT Marketplace",
      description: "Thị trường NFT với tài sản thực được token hóa"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Staking Pool",
      description: "Hệ thống staking đa tầng với phần thưởng hấp dẫn"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "DAO Governance",
      description: "Hệ thống quản trị phi tập trung do cộng đồng điều hành"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={handleSignOut} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Về CAN Network</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Xây dựng tương lai tài chính phi tập trung với công nghệ blockchain tiên tiến
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Card className="glass p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="text-2xl font-bold">50K+</div>
                      <div className="text-xs text-muted-foreground">Người dùng</div>
                    </div>
                  </div>
                </Card>
                <Card className="glass p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <div className="text-2xl font-bold">$100M+</div>
                      <div className="text-xs text-muted-foreground">TVL</div>
                    </div>
                  </div>
                </Card>
                <Card className="glass p-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    <div className="text-left">
                      <div className="text-2xl font-bold">150+</div>
                      <div className="text-xs text-muted-foreground">Quốc gia</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">Giới thiệu chung</h2>
                  <p className="text-muted-foreground mb-4">
                    CAN Network là nền tảng blockchain tiên tiến, cung cấp giải pháp tài chính phi tập trung toàn diện. 
                    Chúng tôi kết hợp công nghệ blockchain với các mô hình kinh doanh thực tế để tạo ra giá trị bền vững.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi cam kết mang đến 
                    trải nghiệm đầu tư an toàn, minh bạch và sinh lời cao cho người dùng.
                  </p>
                  <div className="flex gap-4 mt-6">
                    <Button className="gap-2">
                      <Rocket className="w-4 h-4" />
                      Bắt đầu đầu tư
                    </Button>
                    <Button variant="outline">Tìm hiểu thêm</Button>
                  </div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <Card className="glass p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">An toàn & Minh bạch</h3>
                          <p className="text-sm text-muted-foreground">
                            Mọi giao dịch được bảo mật bởi blockchain và có thể kiểm chứng công khai
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Sinh lời cao</h3>
                          <p className="text-sm text-muted-foreground">
                            Mô hình kinh doanh đa dạng với tiềm năng lợi nhuận hấp dẫn
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-6 h-6 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Cộng đồng mạnh</h3>
                          <p className="text-sm text-muted-foreground">
                            Hơn 50,000 nhà đầu tư trên toàn thế giới tin tưởng và sử dụng
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Đội ngũ lãnh đạo</h2>
                <p className="text-muted-foreground">
                  Những chuyên gia hàng đầu với kinh nghiệm dày dặn trong lĩnh vực công nghệ và tài chính
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {leaders.map((leader, index) => (
                  <Card 
                    key={index} 
                    className="glass hover:scale-105 transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                        <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold mb-1">{leader.name}</h3>
                      <p className="text-sm text-primary mb-2">{leader.position}</p>
                      <p className="text-xs text-muted-foreground">{leader.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass border-primary/30 animate-fade-in">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Tầm nhìn</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Trở thành nền tảng blockchain hàng đầu khu vực Đông Nam Á, kết nối hàng triệu người dùng 
                      với hệ sinh thái tài chính phi tập trung.
                    </p>
                    <p className="text-muted-foreground">
                      Chúng tôi hướng tới một tương lai nơi mọi người đều có thể tiếp cận các dịch vụ tài chính 
                      một cách dễ dàng, minh bạch và công bằng thông qua công nghệ blockchain.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-secondary/30 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Sứ mệnh</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Cung cấp giải pháp tài chính phi tập trung an toàn, hiệu quả và dễ sử dụng cho tất cả mọi người.
                    </p>
                    <p className="text-muted-foreground">
                      Xây dựng cộng đồng blockchain mạnh mẽ, nơi mọi thành viên đều có quyền tham gia quản trị 
                      và chia sẻ lợi nhuận một cách công bằng và minh bạch.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Đối tác chiến lược</h2>
                <p className="text-muted-foreground">
                  Hợp tác với các tổ chức hàng đầu trong ngành blockchain và tài chính
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {partners.map((partner, index) => (
                  <Card 
                    key={index}
                    className="glass hover:scale-105 transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{partner.name}</h3>
                      <p className="text-xs text-muted-foreground">{partner.type}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Business Ecosystem */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Hệ sinh thái kinh doanh</h2>
                <p className="text-muted-foreground">
                  Hệ sinh thái đa dạng với nhiều sản phẩm và dịch vụ blockchain
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ecosystem.map((item, index) => (
                  <Card 
                    key={index}
                    className="glass border-primary/30 hover:scale-105 transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-white">
                        {item.icon}
                      </div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="py-16 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Sơ đồ tổ chức doanh nghiệp</h2>
                <p className="text-muted-foreground">
                  Cấu trúc tổ chức chuyên nghiệp và hiệu quả
                </p>
              </div>
              <Card className="glass p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      Ban Giám Đốc
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 font-semibold">
                        Phòng Công nghệ
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Blockchain Dev, Smart Contracts, Security
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg bg-secondary/20 border border-secondary/30 font-semibold">
                        Phòng Kinh doanh
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Sales, Marketing, Partnership
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 font-semibold">
                        Phòng Vận hành
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Operations, Support, Compliance
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Liên hệ với chúng tôi</h2>
                <p className="text-muted-foreground">
                  Gửi thông tin của bạn, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="mt-2"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="mt-2"
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-2"
                          placeholder="0901234567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Nội dung *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="mt-2 min-h-[120px]"
                          placeholder="Nhập nội dung cần liên hệ..."
                        />
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <Send className="w-4 h-4" />
                        Gửi thông tin
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <p className="text-sm text-muted-foreground">contact@cannetwork.io</p>
                          <p className="text-sm text-muted-foreground">support@cannetwork.io</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Điện thoại</h3>
                          <p className="text-sm text-muted-foreground">+84 901 234 567</p>
                          <p className="text-sm text-muted-foreground">+84 901 234 568 (24/7 Support)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Địa chỉ</h3>
                          <p className="text-sm text-muted-foreground">
                            Tầng 15, Tòa nhà FPT, 10 Phạm Văn Bạch
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cầu Giấy, Hà Nội, Việt Nam
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
