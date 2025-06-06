
import { useState } from 'react';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import FinalTableFilters from '@/components/final-table/FinalTableFilters';
import FinalTableCard from '@/components/final-table/FinalTableCard';
import { useFinalTableList } from '@/hooks/useFinalTableList';
import { Trophy } from 'lucide-react';

const FinalTableList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    performances,
    allPerformances,
    isLoading,
    filters,
    updateFilter,
    clearFilters
  } = useFinalTableList();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-poker-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Header onMenuClick={toggleSidebar} />
        <div className="container mx-auto p-6">
          <div className="text-center py-10">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="container mx-auto p-6">
        {/* Header da página */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-[#d4af37]" />
            <h1 className="text-2xl font-bold text-poker-text-dark">
              Minhas Final Tables
            </h1>
          </div>
          <p className="text-gray-600">
            Visualize todos os torneios onde você chegou à Final Table
          </p>
        </div>

        {/* Filtros */}
        <FinalTableFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          allPerformances={allPerformances}
        />

        {/* Lista de Final Tables */}
        {performances.length === 0 ? (
          <div className="text-center py-10">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {allPerformances.length === 0 
                ? 'Você ainda não registrou nenhuma Final Table.' 
                : 'Nenhuma Final Table encontrada com os filtros aplicados.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Exibindo {performances.length} de {allPerformances.length} Final Tables
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performances.map((performance) => (
                <FinalTableCard
                  key={performance.id}
                  performance={performance}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinalTableList;
