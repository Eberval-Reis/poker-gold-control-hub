
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CadastroTorneioSection from "@/components/backing/CadastroTorneioSection";
import CadastroBankrollSection from "@/components/backing/CadastroBankrollSection";
import VenderAcoesSection from "@/components/backing/VenderAcoesSection";
import ControleBackersSection from "@/components/backing/ControleBackersSection";
import RegistrarResultadoSection from "@/components/backing/RegistrarResultadoSection";
import BackingDashboardSection from "@/components/backing/BackingDashboardSection";
import { useIsMobile } from "@/hooks/use-mobile";

type Modalidade = "torneio" | "bankroll" | null;

const BackingManagement = () => {
  const [currentTab, setCurrentTab] = React.useState("cadastro");
  const [modalidadeSelecionada, setModalidadeSelecionada] = React.useState<Modalidade>(null);
  const isMobile = useIsMobile();

  const handleTabSelect = (v: string) => {
    if (v === "cadastro") setModalidadeSelecionada("torneio");
    if (v === "bankroll") setModalidadeSelecionada("bankroll");
    setCurrentTab(v);
  };

  const getTabOptions = () => [
    {
      value: "cadastro",
      label: "Cadastrar Torneio",
      disabled: false
    },
    {
      value: "bankroll",
      label: "Cadastrar Bankroll",
      disabled: false
    },
    { value: "vender", label: "Vender Ações", disabled: false },
    { value: "controle", label: "Controle de Backers", disabled: false },
    { value: "resultado", label: "Registrar Resultado", disabled: false },
    { value: "dashboard", label: "Dashboard", disabled: false },
  ];

  const tabOptions = getTabOptions();

  return (
    <div className="container mx-auto px-1 sm:px-2 py-5 sm:py-8 max-w-2xl sm:max-w-4xl">
      <h1 className="text-2xl sm:text-2xl font-bold text-poker-gold mb-2 sm:mb-4 text-center sm:text-left">
        Gestão de Cavalagem
      </h1>

      {modalidadeSelecionada && (
        <div className="mb-4 p-2 bg-muted rounded-md flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Modalidade: <strong className="text-foreground">
              {modalidadeSelecionada === "torneio" ? "Torneio" : "Bankroll"}
            </strong>
          </span>
          <button
            onClick={() => setModalidadeSelecionada(null)}
            className="text-xs text-primary hover:underline"
          >
            Trocar modalidade
          </button>
        </div>
      )}

      {isMobile && (
        <div className="mb-4">
          <label htmlFor="tab-select" className="sr-only">Selecionar seção</label>
          <select
            id="tab-select"
            value={currentTab}
            onChange={e => handleTabSelect(e.target.value)}
            className="w-full p-2 rounded border border-input bg-muted font-semibold text-poker-gold"
          >
            {tabOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label} {opt.disabled ? "(desativado)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <Tabs value={currentTab} onValueChange={handleTabSelect} className="w-full">
        {!isMobile && (
          <TabsList
            className="mb-6 w-full max-w-full flex gap-1 bg-muted rounded-md overflow-x-auto"
            style={{ minHeight: "40px", height: "auto", padding: "0.25rem 0.25rem", flexWrap: "nowrap" }}
          >
            {tabOptions.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className="px-2 py-1 text-sm min-w-[90px] h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                data-active={currentTab === tab.value ? "true" : "false"}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        <TabsContent value="cadastro">
          <CadastroTorneioSection />
        </TabsContent>
        <TabsContent value="bankroll">
          <CadastroBankrollSection />
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
