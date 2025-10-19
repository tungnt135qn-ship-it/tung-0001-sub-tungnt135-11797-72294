import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Blockchain network" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Nền tảng{" "}
            <span className="gradient-text text-glow">Blockchain</span>
            <br />
            Thế hệ mới
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Đầu tư thông minh, giao dịch NFT và nhận phần thưởng hấp dẫn mỗi ngày
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" variant="gradient" className="text-lg px-8">
              Bắt đầu đầu tư
              <TrendingUp className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Tìm hiểu thêm
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="glass rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <div className="text-3xl font-bold gradient-text">50K+</div>
              </div>
              <div className="text-muted-foreground">Người dùng</div>
            </div>

            <div className="glass rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <div className="text-3xl font-bold gradient-text">$2.5M+</div>
              </div>
              <div className="text-muted-foreground">Tổng vốn đầu tư</div>
            </div>

            <div className="glass rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-primary" />
                <div className="text-3xl font-bold gradient-text">99.9%</div>
              </div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
