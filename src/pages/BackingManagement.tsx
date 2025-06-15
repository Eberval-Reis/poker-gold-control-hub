
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CadastroTorneioSection from "@/components/backing/CadastroTorneioSection";
import VenderAcoesSection from "@/components/backing/VenderAcoesSection";
import ControleBackersSection from "@/components/backing/ControleBackersSection";
import RegistrarResultadoSection from "@/components/backing/RegistrarResultadoSection";
import BackingDashboardSection from "@/components/backing/BackingDashboardSection";
import { Select } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

const tabOptions = [
  { value: "cadastro", label: "Cadastrar Torneio" },
  { value: "vender", label: "Vender Ações" },
  { value: "controle", label: "Controle de Backers" },
  { value: "resultado", label: "Registrar Resultado" },
  { value: "dashboard", label: "Dashboard" },
];

const BackingManagement = () => {
  // Em vez de defaultValue fixo, guardar o tab no state:
  const [currentTab, setCurrentTab] = React.useState("cadastro");
  const isMobile = useIsMobile();

  // Sincronizar abas do select e tabs
  const handleTabSelect = (v: string) => setCurrentTab(v);

  return (
    <div className="container mx-auto px-1 sm:px-2 py-5 sm:py-8 max-w-2xl sm:max-w-4xl">
      <h1 className="text-2xl sm:text-2xl font-bold text-poker-gold mb-2 sm:mb-4 text-center sm:text-left">
        Gestão de Cavalagem
      </h1>

      {/* Seleção de abas mobile (select), desktop (tabs) */}
      {isMobile ? (
        <div className="mb-4">
          <label htmlFor="tab-select" className="sr-only">Selecionar seção</label>
          <select
            id="tab-select"
            value={currentTab}
            onChange={e => handleTabSelect(e.target.value)}
            className="w-full p-2 rounded border border-input bg-muted font-semibold text-poker-gold"
          >
            {tabOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <TabsList
          className="mb-6 w-full max-w-full flex gap-1 bg-muted rounded-md overflow-x-auto"
          style={{ minHeight: "40px", height: "auto", padding: "0.25rem 0.25rem", flexWrap: "nowrap" }}
        >
          {tabOptions.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-2 py-1 text-sm min-w-[100px] h-8"
              onClick={() => handleTabSelect(tab.value)}
              data-active={currentTab === tab.value ? "true" : "false"}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      <Tabs value={currentTab} onValueChange={handleTabSelect} className="w-full">
        <TabsContent value="cadastro">
          <CadastroTorneioSection />
        </TabsContent>
        <TabsContent value="vender">
          <VenderAcoesSection />
        </TabsContent>
        <TabsContent value="controle">
          <ControleBackersSection />
        </TabsContent>
        <TabsContent value="resultado">
          <RegistrarResultadoSection />
        </TabsContent>
        <TabsContent value="dashboard">
          <BackingDashboardSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackingManagement;
