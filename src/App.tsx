
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import CreateBuyRequest from "./pages/CreateBuyRequest";
import BuyRequestDetail from "./pages/BuyRequestDetail";
import Marketplace from "./pages/Marketplace";
import MyRequests from "./pages/MyRequests";
import MyOffers from "./pages/MyOffers";
import MyPosts from "./pages/MyPosts";
import PostDetail from "./pages/PostDetail";
import SendOffer from "./pages/SendOffer";
import OfferDetail from "./pages/OfferDetail";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      <TooltipProvider>
        <div className="safe-all min-h-screen">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-buy-request" element={<CreateBuyRequest />} />
              <Route path="/buy-request/:id" element={<BuyRequestDetail />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/my-offers" element={<MyOffers />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/post-detail/:id" element={<PostDetail />} />
              <Route path="/send-offer/:buyRequestId" element={<SendOffer />} />
              <Route path="/offer/:id" element={<OfferDetail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
