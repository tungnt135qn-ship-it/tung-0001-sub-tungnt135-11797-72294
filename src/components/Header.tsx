import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogOut, LogIn, Bell, Globe, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  session: Session | null;
  onSignOut: () => void;
}

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

export const Header = ({ session, onSignOut }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        setUserProfile(null);
        return;
      }
      
      try {
        const response = await (supabase as any)
          .from("profiles")
          .select("username, avatar_url")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (response.data) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
    onSignOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-glow">
              <span className="text-2xl font-bold">₿</span>
            </div>
            <span className="text-xl font-bold gradient-text">CryptoHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground/80 hover:text-primary transition-colors">
              Trang chủ
            </a>
            <a href="/investment" className="text-foreground/80 hover:text-primary transition-colors">
              Đầu tư
            </a>
            <a href="/membership" className="text-foreground/80 hover:text-primary transition-colors">
              Mua hạng
            </a>
            <a href="/nft-market" className="text-foreground/80 hover:text-primary transition-colors">
              NFT Market
            </a>
            <a href="/missions" className="text-foreground/80 hover:text-primary transition-colors">
              Nhiệm vụ
            </a>
            <a href="/staking" className="text-foreground/80 hover:text-primary transition-colors">
              Staking
            </a>
            <a href="/about" className="text-foreground/80 hover:text-primary transition-colors">
              Về chúng tôi
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                >
                  <Globe className="w-5 h-5" />
                </Button>
                <Button 
                  variant="gradient" 
                  className="hidden md:flex"
                  onClick={() => navigate("/wallet")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Kết nối ví
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center space-x-2 h-auto py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.avatar_url || ""} />
                        <AvatarFallback>{userProfile?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{userProfile?.username || "User"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      <User className="w-4 h-4 mr-2" />
                      Quản lý tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="gradient"
                className="hidden md:flex"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <a href="/" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Trang chủ
              </a>
              <a href="/investment" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Đầu tư
              </a>
              <a href="/membership" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Mua hạng
              </a>
              <a href="/nft-market" className="text-foreground/80 hover:text-primary transition-colors py-2">
                NFT Market
              </a>
              <a href="/missions" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Nhiệm vụ
              </a>
              <a href="/staking" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Staking
              </a>
              {session ? (
                <>
                  <div className="flex items-center space-x-2 py-2 border-t border-border/50 mt-2">
                    <Button variant="ghost" size="icon" className="flex-1">
                      <Bell className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="flex-1">
                      <Globe className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button 
                    variant="gradient" 
                    className="w-full mt-2"
                    onClick={() => navigate("/wallet")}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Kết nối ví
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/account")}>
                    <User className="w-4 h-4 mr-2" />
                    Quản lý tài khoản
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button variant="gradient" className="w-full mt-2" onClick={() => navigate("/auth")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
