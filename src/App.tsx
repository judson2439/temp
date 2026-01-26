import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import { Header } from "@/components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import BuyLand from "@/pages/BuyLand";
import PropertyDetail from "@/pages/PropertyDetail";
import SellLand from "@/pages/SellLand";
import HowItWorksPage from "@/pages/HowItWorksPage";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Terms from "@/pages/Terms";
import Dashboard from "@/pages/Dashboard";
import AdminPanel from "@/pages/AdminPanel";
import SellerDashboard from "@/pages/SellerDashboard";
import PostLand from "@/pages/PostLand";
import Messages from "@/pages/Messages";


const queryClient = new QueryClient();

// Component to handle route changes and scroll to top
const RouteChangeHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// Admin Route Protection Component

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // Check for admin session
  const adminSession = localStorage.getItem('adminSession');
  if (adminSession) {
    try {
      const parsed = JSON.parse(adminSession);
      if (parsed.isAdmin) {
        return <>{children}</>;
      }
    } catch {
      localStorage.removeItem('adminSession');
    }
  }
  
  // Also check regular session for admin role
  const session = localStorage.getItem('session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed.user?.role === 'admin' || parsed.isAdmin) {
        return <>{children}</>;
      }
    } catch {
      localStorage.removeItem('session');
    }
  }
  
  // Check userRole in localStorage
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" replace />;
};


// Seller Route Protection Component
const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const session = localStorage.getItem('session');
  const userRole = localStorage.getItem('userRole');
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const parsed = JSON.parse(session);
    if (!parsed.user) {
      return <Navigate to="/login" replace />;
    }
    // Check if user is a seller
    if (parsed.user.role !== 'seller' && userRole !== 'seller') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    localStorage.removeItem('session');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Panel - No Header/Footer */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                {/* Regular routes with Header/Footer */}
                <Route path="*" element={
                  <>
                    <Header />
                    <RouteChangeHandler />
                    <Routes>
                      {/* Public routes - no authentication required */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<Login />} />
                      <Route path="/reset-password" element={<Login />} />
                      <Route path="/" element={<Index />} />
                      <Route path="/terms" element={<Terms />} />
                      
                      {/* Protected routes - authentication required */}
                      <Route path="/buy" element={
                        <ProtectedRoute>
                          <BuyLand />
                        </ProtectedRoute>
                      } />
                      <Route path="/property/:id" element={
                        <ProtectedRoute>
                          <PropertyDetail />
                        </ProtectedRoute>
                      } />
                      <Route path="/sell" element={<SellLand />} />

                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      
                      <Route path="/about" element={<AboutUs />} />

                      <Route path="/contact" element={<Contact />} />


                      {/* Buyer Dashboard */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />

                      {/* Seller Dashboard */}
                      <Route path="/seller-dashboard" element={
                        <SellerRoute>
                          <SellerDashboard />
                        </SellerRoute>
                      } />

                      {/* Post Land - Seller only */}
                      <Route path="/post-land" element={
                        <SellerRoute>
                          <PostLand />
                        </SellerRoute>
                      } />

                      {/* Messages - Protected for both buyers and sellers */}
                      <Route path="/messages" element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      } />


                    </Routes>
                    <Footer />
                  </>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};


export default App;
