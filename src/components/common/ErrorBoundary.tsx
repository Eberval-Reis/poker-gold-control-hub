
import React from "react";

// Componente de Error Boundary global para capturar erros de UI
type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Pode-se enviar logs para serviço externo aqui.
    console.error("ErrorBoundary capturou um erro:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Ocorreu um erro inesperado.</h2>
          <p className="text-gray-700 mb-4">Por favor, recarregue a página ou entre em contato com o suporte.</p>
          <details className="text-xs text-muted-foreground">
            {this.state.error?.message}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
