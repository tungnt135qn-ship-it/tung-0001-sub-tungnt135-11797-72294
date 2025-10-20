import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  session: Session | null;
  onSignOut: () => void;
}

export const Header = ({ session, onSignOut }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
            {session && (
              <a href="/account" className="text-foreground/80 hover:text-primary transition-colors">
                Tài khoản
              </a>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button 
                  variant="gradient" 
                  className="hidden md:flex"
                  onClick={() => navigate("/wallet")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Kết nối ví
                </Button>
                <Button
                  variant="ghost"
                  className="hidden md:flex"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
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
              {session && (
                <a href="/account" className="text-foreground/80 hover:text-primary transition-colors py-2">
                  Tài khoản
                </a>
              )}
              {session ? (
                <>
                  <Button 
                    variant="gradient" 
                    className="w-full mt-2"
                    onClick={() => navigate("/wallet")}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Kết nối ví
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
