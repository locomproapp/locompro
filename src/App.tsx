
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Market from "./pages/Market";
import PostDetail from "./pages/PostDetail";
import MyRequests from "./pages/MyRequests";
import MyOffers from "./pages/MyOffers";
import Marketplace from "./pages/Marketplace";
import BuyRequestDetail from "./pages/BuyRequestDetail";
import OfferDetail from "./pages/OfferDetail";
import CreateBuyRequest from "./pages/CreateBuyRequest";
import SendOffer from "./pages/SendOffer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/market" element={<Market />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/buy-request/:id" element={<BuyRequestDetail />} />
          <Route path="/buy-request/:id/send-offer" element={<SendOffer />} />
          <Route path="/offer/:id" element={<OfferDetail />} />
          <Route path="/create-buy-request" element={<CreateBuyRequest />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-offers" element={<MyOffers />} />
          <Route path="/profile/:id" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
