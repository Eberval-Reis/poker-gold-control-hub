
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
        <TabsList className="mb-6 gap-2 w-full max-w-2xl overflow-auto">
          <TabsTrigger value="cadastro">Cadastrar Torneio</TabsTrigger>
          <TabsTrigger value="vender">Vender Ações</TabsTrigger>
          <TabsTrigger value="controle">Controle de Backers</TabsTrigger>
          <TabsTrigger value="resultado">Registrar Resultado</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
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
