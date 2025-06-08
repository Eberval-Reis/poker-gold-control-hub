
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import TournamentList from "./pages/TournamentList";
import RegisterTournament from "./pages/RegisterTournament";
import ClubList from "./pages/ClubList";
import RegisterClub from "./pages/RegisterClub";
import TournamentPerformanceList from "./pages/TournamentPerformanceList";
import RegisterTournamentPerformance from "./pages/RegisterTournamentPerformance";
import ExpenseList from "./pages/ExpenseList";
import RegisterExpense from "./pages/RegisterExpense";
import TournamentResults from "./pages/TournamentResults";
import FinalTableList from "./pages/FinalTableList";
import Report from "./pages/Report";
import BackingDashboard from "./pages/BackingDashboard";
import CreateBackingOffer from "./pages/CreateBackingOffer";
import BackingInvestment from "./pages/BackingInvestment";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
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
                            <Route path="/tournament-results" element={<TournamentResults />} />
                            <Route path="/final-tables" element={<FinalTableList />} />
                            <Route path="/report" element={<Report />} />
                            <Route path="/backing" element={<BackingDashboard />} />
                            <Route path="/backing/create" element={<CreateBackingOffer />} />
                            <Route path="/backing/invest/:offerId" element={<BackingInvestment />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
