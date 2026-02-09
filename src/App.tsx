import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
// Lazy loading dos componentes pesados
const TournamentList = lazy(() => import("./pages/TournamentList"));
const RegisterTournament = lazy(() => import("./pages/RegisterTournament"));
const ClubList = lazy(() => import("./pages/ClubList"));
const RegisterClub = lazy(() => import("./pages/RegisterClub"));
const TournamentPerformanceList = lazy(() => import("./pages/TournamentPerformanceList"));
const RegisterTournamentPerformance = lazy(() => import("./pages/RegisterTournamentPerformance"));
const ExpenseList = lazy(() => import("./pages/ExpenseList"));
const RegisterExpense = lazy(() => import("./pages/RegisterExpense"));
const FinalTableList = lazy(() => import("./pages/FinalTableList"));
const Report = lazy(() => import("./pages/Report"));
const Schedule = lazy(() => import("./pages/Schedule"));
const BackingManagement = lazy(() => import("./pages/BackingManagement"));

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={
                        <div className="flex items-center justify-center min-h-screen">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      }>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/tournaments" element={<TournamentList />} />
                          <Route path="/register-tournament" element={<RegisterTournament />} />
                          <Route path="/register-tournament/:id" element={<RegisterTournament />} />
                          <Route path="/clubs" element={<ClubList />} />
                          <Route path="/register-club" element={<RegisterClub />} />
                          <Route path="/register-club/:id" element={<RegisterClub />} />
                          <Route path="/tournament-performances" element={<TournamentPerformanceList />} />
                          <Route path="/register-tournament-performance" element={<RegisterTournamentPerformance />} />
                          <Route path="/register-tournament-performance/:id" element={<RegisterTournamentPerformance />} />
                          <Route path="/expenses" element={<ExpenseList />} />
                          <Route path="/register-expense" element={<RegisterExpense />} />
                          <Route path="/register-expense/:id" element={<RegisterExpense />} />
                          <Route path="/final-tables" element={<FinalTableList />} />
                          <Route path="/report" element={<Report />} />
                          <Route path="/schedule" element={<Schedule />} />
                          <Route path="/backing-management" element={<BackingManagement />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <PWAInstallPrompt />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;