import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import Invitations from "@/pages/Invitations";
import Guests from "@/pages/Guests";
import Gifts from "@/pages/Gifts";
import Vendors from "@/pages/Vendors";
import PublicRSVP from "@/pages/PublicRSVP";
import PublicGifts from "@/pages/PublicGifts";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin routes */}
            <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/convites" element={<AdminLayout><Invitations /></AdminLayout>} />
            <Route path="/convidados" element={<AdminLayout><Guests /></AdminLayout>} />
            <Route path="/presentes" element={<AdminLayout><Gifts /></AdminLayout>} />
            <Route path="/fornecedores" element={<AdminLayout><Vendors /></AdminLayout>} />
            {/* Public routes */}
            <Route path="/rsvp/:slug" element={<PublicRSVP />} />
            <Route path="/gifts/:slug" element={<PublicGifts />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
