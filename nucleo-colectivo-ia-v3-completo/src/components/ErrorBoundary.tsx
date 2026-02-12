import React from 'react';
import { motion } from 'framer-motion';
import { ConcentricCircles } from './nucleo-identity/ConcentricCircles';

const serializeError = (error: any) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
  }
  return error;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: any): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const errorDetails = serializeError(this.state.error);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-nucleo-white via-gray-50 to-nucleo-purple/10 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-nucleo-purple to-nucleo-violet p-6 text-white">
              <div className="flex items-center space-x-4">
                <ConcentricCircles size="sm" color="yellow" animated={false} />
                <div>
                  <h1 className="text-2xl font-bold font-montserrat">
                    ¡Oops! Algo no salió como esperábamos
                  </h1>
                  <p className="text-nucleo-yellow/80 font-lora">
                    El Núcleo Colectivo encontró un problema técnico
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Friendly Message */}
              <div className="text-center space-y-3">
                <div className="text-6xl mb-4">🤖💥</div>
                <h2 className="text-xl font-semibold text-gray-800 font-montserrat">
                  Nuestros robots están trabajando en ello
                </h2>
                <p className="text-gray-600 font-lora">
                  Parece que una de nuestras redes neuronales necesita una pequeña recalibración. 
                  No te preocupes, esto pasa hasta en las mejores familias digitales.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-nucleo-purple text-white rounded-lg font-medium hover:bg-nucleo-violet transition-colors font-montserrat"
                >
                  🔄 Reintentar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleGoHome}
                  className="px-6 py-3 bg-nucleo-yellow text-nucleo-black rounded-lg font-medium hover:bg-yellow-400 transition-colors font-montserrat"
                >
                  🏠 Volver al Inicio
                </motion.button>
              </div>

              {/* Technical Details (Collapsible) */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-roboto-mono">
                  🔍 Detalles técnicos (para desarrolladores)
                </summary>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-2 text-xs font-roboto-mono">
                    <div>
                      <span className="font-semibold">Error:</span>{' '}
                      <span className="text-red-600">{errorDetails?.name || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Mensaje:</span>{' '}
                      <span className="text-red-600">{errorDetails?.message || 'No message'}</span>
                    </div>
                    {errorDetails?.stack && (
                      <div>
                        <span className="font-semibold">Stack trace:</span>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">
                          {errorDetails.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <span className="font-semibold">Component stack:</span>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* Support Info */}
              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>¿El problema persiste? Contáctanos:</p>
                <p className="font-roboto-mono">
                  📧 soporte@nucleocolectivo.org • 🐛 GitHub Issues
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Versión: Educación IA Global • Build: {process.env.NODE_ENV || 'development'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}