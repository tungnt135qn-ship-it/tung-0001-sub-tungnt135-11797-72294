import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const SellNFT = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalValue: "",
    totalShares: "100",
    pricePerShare: "",
    image: "",
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
    
    if (!session) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để đăng bán NFT",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "NFT của bạn đã được đăng bán!",
    });

    setTimeout(() => {
      navigate("/nft-market");
    }, 1500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "totalValue" || name === "totalShares") {
      const totalValue = name === "totalValue" ? parseFloat(value) : parseFloat(formData.totalValue);
      const totalShares = name === "totalShares" ? parseFloat(value) : parseFloat(formData.totalShares);
      
      if (totalValue && totalShares) {
        setFormData((prev) => ({
          ...prev,
          pricePerShare: (totalValue / totalShares).toFixed(2),
        }));
      }
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header session={session} onSignOut={handleSignOut} />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để đăng bán NFT</p>
          <Button onClick={() => navigate("/auth")}>Đăng nhập</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/nft-market")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <h1 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Đăng bán NFT</span>
          </h1>

          <Card className="p-6 glass">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="image">Hình ảnh NFT</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nhấp để tải lên hoặc kéo thả hình ảnh
                  </p>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name">Tên NFT</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên NFT"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về NFT"
                  required
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalValue">Giá trị tổng (USD)</Label>
                  <Input
                    id="totalValue"
                    name="totalValue"
                    type="number"
                    step="0.01"
                    value={formData.totalValue}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="totalShares">Tổng số cổ phần</Label>
                  <Input
                    id="totalShares"
                    name="totalShares"
                    type="number"
                    value={formData.totalShares}
                    onChange={handleInputChange}
                    placeholder="100"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pricePerShare">Giá mỗi cổ phần (USD)</Label>
                <Input
                  id="pricePerShare"
                  name="pricePerShare"
                  type="number"
                  step="0.01"
                  value={formData.pricePerShare}
                  readOnly
                  placeholder="Tự động tính"
                  className="mt-2 bg-muted/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Được tính tự động từ giá trị tổng và số cổ phần
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Đăng bán
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/nft-market")}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellNFT;
