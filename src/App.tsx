
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterClub from "./pages/RegisterClub";
import RegisterTournament from "./pages/RegisterTournament";
import RegisterExpense from "./pages/RegisterExpense";
import ClubList from "./pages/ClubList";
import TournamentList from "./pages/TournamentList";
import ExpenseList from "./pages/ExpenseList";
import Report from "./pages/Report";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/register-club" element={<RegisterClub />} />
            <Route path="/register-club/:id" element={<RegisterClub />} />
            <Route path="/register-tournament" element={<RegisterTournament />} />
            <Route path="/register-tournament/:id" element={<RegisterTournament />} />
            <Route path="/register-expense" element={<RegisterExpense />} />
            <Route path="/register-expense/:id" element={<RegisterExpense />} />
            <Route path="/clubs" element={<ClubList />} />
            <Route path="/tournaments" element={<TournamentList />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/report" element={<Report />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
