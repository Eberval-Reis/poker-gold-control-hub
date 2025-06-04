
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TournamentResultForm } from '@/components/tournament-result/TournamentResultForm';

const TournamentResults = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Resultado Torneios</h1>
            <p className="text-gray-600 mt-2">
              Registre os resultados alcançados nos torneios jogados
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Novo Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentResultForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TournamentResults;
