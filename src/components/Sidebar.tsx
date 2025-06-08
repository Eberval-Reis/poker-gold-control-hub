
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  CreditCard, 
  FileText, 
  Home, 
  Trophy, 
  Users,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tournaments', icon: Calendar, label: 'Torneios' },
    { path: '/clubs', icon: Building2, label: 'Clubes' },
    { path: '/tournament-performances', icon: Trophy, label: 'Performances' },
    { path: '/expenses', icon: CreditCard, label: 'Despesas' },
    { path: '/tournament-results', icon: BarChart3, label: 'Resultados' },
    { path: '/final-tables', icon: Users, label: 'Final Tables' },
    { path: '/report', icon: FileText, label: 'Relatórios' },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Poker Manager</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
