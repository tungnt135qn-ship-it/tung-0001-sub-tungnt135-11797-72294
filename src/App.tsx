import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomCursor } from "@/components/CustomCursor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Investment from "./pages/Investment";
import PhaseDetail from "./pages/PhaseDetail";
import MembershipShop from "./pages/MembershipShop";
import TierDetail from "./pages/TierDetail";
import NFTMarket from "./pages/NFTMarket";
import NFTDetail from "./pages/NFTDetail";
import Missions from "./pages/Missions";
import AccountManagement from "./pages/AccountManagement";
import NewsDetail from "./pages/NewsDetail";
import SellNFT from "./pages/SellNFT";
import WalletConnect from "./pages/WalletConnect";
import AboutUs from "./pages/AboutUs";
import Staking from "./pages/Staking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/phase/:phaseId" element={<PhaseDetail />} />
          <Route path="/membership" element={<MembershipShop />} />
          <Route path="/tier/:tierId" element={<TierDetail />} />
          <Route path="/nft-market" element={<NFTMarket />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/account" element={<AccountManagement />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/sell-nft" element={<SellNFT />} />
          <Route path="/wallet" element={<WalletConnect />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/staking" element={<Staking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
