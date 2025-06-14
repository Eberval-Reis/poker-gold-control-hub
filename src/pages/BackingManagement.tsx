
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CadastroTorneioSection from "@/components/backing/CadastroTorneioSection";
import VenderAcoesSection from "@/components/backing/VenderAcoesSection";
import ControleBackersSection from "@/components/backing/ControleBackersSection";
import RegistrarResultadoSection from "@/components/backing/RegistrarResultadoSection";
import BackingDashboardSection from "@/components/backing/BackingDashboardSection";

const BackingManagement = () => {
  return (
    <div className="container mx-auto px-2 py-8">
      <h1 className="text-2xl font-bold text-poker-gold mb-2">Gestão de Cavalagem</h1>
      <Tabs defaultValue="cadastro" className="w-full">
        <TabsList
          className="mb-6 w-full max-w-full flex gap-1 bg-muted rounded-md overflow-x-auto"
          style={{ minHeight: "40px", height: "auto", padding: "0.25rem 0.25rem", flexWrap: "nowrap" }}
        >
          <TabsTrigger
            value="cadastro"
            className="px-2 py-1 text-sm min-w-[100px] h-8"
          >
            Cadastrar Torneio
          </TabsTrigger>
          <TabsTrigger
            value="vender"
            className="px-2 py-1 text-sm min-w-[100px] h-8"
          >
            Vender Ações
          </TabsTrigger>
          <TabsTrigger
            value="controle"
            className="px-2 py-1 text-sm min-w-[120px] h-8"
          >
            Controle de Backers
          </TabsTrigger>
          <TabsTrigger
            value="resultado"
            className="px-2 py-1 text-sm min-w-[120px] h-8"
          >
            Registrar Resultado
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="px-2 py-1 text-sm min-w-[100px] h-8"
          >
            Dashboard
          </TabsTrigger>
        </TabsList>
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
