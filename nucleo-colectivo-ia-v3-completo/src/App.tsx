import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameContainer } from './components/GameContainer';
import { CompletionScreen } from './components/CompletionScreen';
import { CollaborationManager } from './components/collaboration/CollaborationManager';
import { AudioManager } from './components/audio/AudioManager';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { AchievementNotifications } from './components/gamification/AchievementNotifications';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

// App states
type AppState = 'loading' | 'welcome' | 'game' | 'completed';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    gameStarted,
    gameCompleted,
    userProfile,
    startGame,
    updateUserProfile,
    setInstalled,
    setUpdateAvailable,
    loadMedellinProjects,
    loadEthicsDatabase
  } = useGameStore();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize TensorFlow.js
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        
        // Load global AI projects data
        const globalAIProjects = [
          {
            id: 'singapore-smart-nation',
            name: 'Singapore Smart Nation Initiative',
            organization: 'Government of Singapore',
            description: 'Sistema nacional de IA para gestión urbana inteligente, transporte predictivo y servicios ciudadanos',
            aiTechnology: ['Machine Learning', 'Computer Vision', 'IoT', 'Digital Twins'],
            socialImpact: 'Reducción de 25% en tráfico urbano y 40% en tiempos de respuesta gubernamental',
            status: 'active' as const,
            participants: 5800000,
            website: 'https://www.smartnation.gov.sg',
            images: []
          },
          {
            id: 'helsinki-ai-programme',
            name: 'Elements of AI - University of Helsinki',
            organization: 'University of Helsinki + Reaktor',
            description: 'Programa global de educación en IA democratizando el conocimiento tecnológico mundial',
            aiTechnology: ['NLP', 'Machine Learning', 'Ethics AI', 'Accessibility'],
            socialImpact: 'Más de 1 millón de estudiantes globales capacitados en 170+ países',
            status: 'active' as const,
            participants: 1000000,
            website: 'https://www.elementsofai.com',
            images: []
          },
          {
            id: 'toronto-vector-institute',
            name: 'Vector Institute Toronto',
            organization: 'Vector Institute for AI',
            description: 'Ecosistema mundial de investigación e innovación en IA responsable y ética',
            aiTechnology: ['Deep Learning', 'Responsible AI', 'Healthcare AI', 'Quantum ML'],
            socialImpact: 'Generación de 3500+ empleos especializados y 50+ startups de IA',
            status: 'active' as const,
            participants: 850,
            website: 'https://vectorinstitute.ai',
            images: []
          }
        ];
        
        loadMedellinProjects(globalAIProjects);

        // Load global ethics cases database
        const ethicsCases = [
          {
            id: 'singapore-smart-surveillance',
            title: 'Vigilancia Inteligente vs Privacidad Ciudadana',
            scenario: 'Singapur implementa un sistema nacional de IA para seguridad urbana usando reconocimiento facial, pero genera debate global sobre límites éticos de la vigilancia.',
            context: 'global' as const,
            stakeholders: ['Gobierno de Singapur', 'Ciudadanos', 'Organismos Internacionales', 'Tech Companies', 'ONGs Globales'],
            options: [
              {
                id: 'full-surveillance',
                text: 'Vigilancia completa con IA predictiva',
                consequences: ['Seguridad máxima', 'Prevención del crimen', 'Pérdida de privacidad total'],
                ethicalPrinciples: ['Seguridad', 'Utilidad Social'],
                socialImpact: 'high' as const,
                technicalFeasibility: 'high' as const
              },
              {
                id: 'regulated-system',
                text: 'Sistema regulado con supervisión internacional',
                consequences: ['Seguridad controlada', 'Transparencia algorítmica', 'Complejidad administrativa'],
                ethicalPrinciples: ['Transparencia', 'Responsabilidad', 'Balance'],
                socialImpact: 'medium' as const,
                technicalFeasibility: 'medium' as const
              },
              {
                id: 'citizen-consent',
                text: 'Participación ciudadana y consentimiento explícito',
                consequences: ['Autonomía protegida', 'Implementación gradual', 'Eficacia limitada'],
                ethicalPrinciples: ['Autonomía', 'Consentimiento', 'Participación'],
                socialImpact: 'medium' as const,
                technicalFeasibility: 'high' as const
              }
            ],
            realOutcome: 'Singapur implementó un marco de "IA confiable" con auditorías independientes y participación ciudadana.',
            discussionPoints: [
              'Soberanía digital vs estándares globales',
              'Transparencia algorítmica en sistemas gubernamentales',
              'Derechos humanos en la era de la IA'
            ]
          },
          {
            id: 'eu-ai-act',
            title: 'Regulación Global de IA: El Acta Europea',
            scenario: 'La Unión Europea implementa la primera ley comprehensiva de IA del mundo, afectando empresas tecnológicas globales y estableciendo precedentes internacionales.',
            context: 'global' as const,
            stakeholders: ['Unión Europea', 'Tech Giants', 'Países en Desarrollo', 'Organizaciones Internacionales'],
            options: [
              {
                id: 'strict-regulation',
                text: 'Regulación estricta con sanciones severas',
                consequences: ['Máxima protección ciudadana', 'Innovación restringida', 'Costos elevados'],
                ethicalPrinciples: ['Protección', 'Precaución'],
                socialImpact: 'high' as const,
                technicalFeasibility: 'high' as const
              },
              {
                id: 'innovation-balance',
                text: 'Balance entre innovación y protección',
                consequences: ['Desarrollo sostenible', 'Riesgos controlados', 'Complejidad regulatoria'],
                ethicalPrinciples: ['Balance', 'Sostenibilidad'],
                socialImpact: 'medium' as const,
                technicalFeasibility: 'medium' as const
              }
            ],
            realOutcome: 'El AI Act estableció un marco global de referencia adoptado por 40+ países.',
            discussionPoints: [
              'Competitividad global vs protección ciudadana',
              'Transferencia de tecnología Norte-Sur',
              'Gobernanza global de la IA'
            ]
          }
        ];
        
        loadEthicsDatabase(ethicsCases);

        // Check PWA installation status
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            setInstalled(true);
            
            registration.addEventListener('updatefound', () => {
              setUpdateAvailable(true);
            });
          }
        }

        setIsInitialized(true);
        
        // Determine initial state
        if (gameCompleted) {
          setAppState('completed');
        } else if (gameStarted && userProfile.name) {
          setAppState('game');
        } else {
          setAppState('welcome');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setAppState('welcome'); // Fallback to welcome screen
      }
    };

    initializeApp();
  }, []);

  // Handle app state transitions
  const handleStartGame = (userName: string, avatar: any, preferences: any) => {
    updateUserProfile({ 
      name: userName, 
      avatar,
      preferences 
    });
    startGame();
    setAppState('game');
  };

  const handleGameComplete = () => {
    setAppState('completed');
  };

  const handleRestartGame = () => {
    setAppState('welcome');
  };

  // Render loading screen while initializing
  if (appState === 'loading' || !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-nucleo-white via-gray-50 to-nucleo-purple/10">
          <AnimatePresence mode="wait">
            {appState === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <WelcomeScreen onStartGame={handleStartGame} />
              </motion.div>
            )}

            {appState === 'game' && (
              <motion.div
                key="game"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
              >
                <GameContainer onComplete={handleGameComplete} />
              </motion.div>
            )}

            {appState === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                <CompletionScreen onRestart={handleRestartGame} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global components that are always active */}
          <CollaborationManager />
          <AudioManager />
          <AchievementNotifications />
          <PWAInstallPrompt />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
