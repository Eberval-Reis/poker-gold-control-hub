import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { csvImportService, ImportResult } from '@/services/csv-import.service';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface CSVImportDialogProps {
  onImportComplete?: () => void;
}

const CSVImportDialog = ({ onImportComplete }: CSVImportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
    } else {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV válido.",
      });
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo CSV para importar.",
      });
      return;
    }

    setImporting(true);
    try {
      const result = await csvImportService.importCSVPerformance(file);
      setResults(result);
      
      toast({
        title: "Importação concluída",
        description: `${result.imported} registros importados com sucesso de ${result.processed} processados.`,
      });

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante a importação.",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setResults(null);
    setImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Desempenhos do CSV
          </DialogTitle>
          <DialogDescription>
            Selecione um arquivo CSV com dados de desempenho em torneios para importar automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">Arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
            />
            <p className="text-sm text-muted-foreground">
              O arquivo deve conter as colunas: data_torneio, nome_torneio, valor_buy_in, etc.
            </p>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Processando arquivo...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {results && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Resultados da Importação
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Registros processados:</span>
                  <span className="ml-2 font-medium">{results.processed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Importados com sucesso:</span>
                  <span className="ml-2 font-medium text-green-600">{results.imported}</span>
                </div>
              </div>

              {results.clubsCreated.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clubes criados:</p>
                  <p className="text-sm">{results.clubsCreated.join(', ')}</p>
                </div>
              )}

              {results.tournamentsCreated.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Torneios criados:</p>
                  <p className="text-sm">{results.tournamentsCreated.slice(0, 5).join(', ')}</p>
                  {results.tournamentsCreated.length > 5 && (
                    <p className="text-sm text-muted-foreground">
                      ... e mais {results.tournamentsCreated.length - 5} torneios
                    </p>
                  )}
                </div>
              )}

              {results.errors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Erros encontrados ({results.errors.length})
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {results.errors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-xs text-muted-foreground">{error}</p>
                    ))}
                    {results.errors.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        ... e mais {results.errors.length - 10} erros
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              {results ? 'Fechar' : 'Cancelar'}
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
              className="gap-2"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;