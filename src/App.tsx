import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import EarnSectionPage from "./pages/EarnSectionPage";
import HomeDashboardPage from "./pages/HomeDashboardPage";
import MarketsPage from "./pages/MarketsPage";
import TradingInterfacePage from "./pages/TradingInterfacePage";
import WalletManagementPage from "./pages/WalletManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<HomeDashboardPage />} />
          <Route path="/earn-section" element={<EarnSectionPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/trading-interface" element={<TradingInterfacePage />} />
          <Route path="/wallet-management" element={<WalletManagementPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
