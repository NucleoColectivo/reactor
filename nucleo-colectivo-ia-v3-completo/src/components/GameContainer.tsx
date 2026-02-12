import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ConcentricCircles } from './nucleo-identity/ConcentricCircles';
import { OfficialNucleoLogo } from './nucleo-identity/OfficialNucleoLogo';

// Module imports
import { Module1Fundamentals } from './modules/Module1Fundamentals';
import { Module2Conversational } from './modules/Module2Conversational';
import { Module3ComputerVision } from './modules/Module3ComputerVision';
import { Module4Generative } from './modules/Module4Generative';
import { Module5NeuralNetworks } from './modules/Module5NeuralNetworks';
import { Module6Ethics } from './modules/Module6Ethics';

interface GameContainerProps {
  onComplete: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onComplete }) => {
  const {
    currentModule,
    moduleProgress,
    userProfile,
    setCurrentModule,
    completeModule,
    getCompletionPercentage,
    getUserLevel,
    addNeurotokens
  } = useGameStore();

  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const modules = [
    {
      id: 'fundamentals',
      component: Module1Fundamentals,
      name: 'Fundamentos de IA Interactivos',
      icon: '🧠',
      color: 'purple',
      estimatedTime: 3,
      difficulty: 'Básico'
    },
    {
      id: 'conversational',
      component: Module2Conversational,
      name: 'IA Conversacional Avanzada',
      icon: '💬',
      color: 'yellow',
      estimatedTime: 3,
      difficulty: 'Intermedio'
    },
    {
      id: 'computer-vision',
      component: Module3ComputerVision,
      name: 'Visión por Computadora Creativa',
      icon: '👁️',
      color: 'violet',
      estimatedTime: 3,
      difficulty: 'Intermedio'
    },
    {
      id: 'generative',
      component: Module4Generative,
      name: 'IA Generativa Multimodal',
      icon: '🎨',
      color: 'green',
      estimatedTime: 3,
      difficulty: 'Avanzado'
    },
    {
      id: 'neural-networks',
      component: Module5NeuralNetworks,
      name: 'Redes Neuronales 3D',
      icon: '🕸️',
      color: 'purple',
      estimatedTime: 3,
      difficulty: 'Avanzado'
    },
    {
      id: 'ethics',
      component: Module6Ethics,
      name: 'Ética IA Global - Casos Internacionales',
      icon: '⚖️',
      color: 'yellow',
      estimatedTime: 3,
      difficulty: 'Básico'
    }
  ];

  const currentModuleData = moduleProgress[currentModule];
  const CurrentModuleComponent = modules[currentModule]?.component;

  // Handle module completion
  const handleModuleComplete = (score: number, achievements: string[] = [], creations: any[] = [], decisions: any[] = []) => {
    if (currentModuleData) {
      completeModule(currentModuleData.id, score, achievements, creations, decisions);
      
      // Award bonus neurotokens for completion
      addNeurotokens(100, `Completed ${currentModuleData.name}`);
      
      // Check if all modules are completed
      const completedCount = moduleProgress.filter(m => m.completed).length;
      if (completedCount === moduleProgress.length - 1) { // -1 because current module just completed
        setTimeout(() => onComplete(), 2000);
      } else {
        // Auto-advance to next module after a delay
        setTimeout(() => {
          const nextModuleIndex = currentModule + 1;
          if (nextModuleIndex < modules.length) {
            handleModuleChange(nextModuleIndex);
          }
        }, 2000);
      }
    }
  };

  // Handle module navigation
  const handleModuleChange = async (moduleIndex: number) => {
    if (moduleIndex === currentModule) return;
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Transition delay
    setCurrentModule(moduleIndex);
    setShowModuleMenu(false);
    setIsTransitioning(false);
  };

  // Handle menu toggle
  const toggleModuleMenu = () => {
    setShowModuleMenu(!showModuleMenu);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nucleo-white via-gray-50 to-nucleo-purple/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and User Info */}
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => window.location.reload()} 
                className="cursor-pointer"
              >
                <OfficialNucleoLogo size="sm" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-nucleo-purple font-montserrat">
                  Educación IA Global
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Hola, {userProfile.name}</span>
                  <Badge variant="secondary">{getUserLevel()}</Badge>
                </div>
              </div>
            </div>

            {/* Progress and Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-nucleo-purple">
                  {userProfile.neurotokens}
                </div>
                <div className="text-xs text-gray-600">Neurotokens</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-nucleo-purple">
                  {Math.round(getCompletionPercentage())}%
                </div>
                <div className="text-xs text-gray-600">Completado</div>
              </div>
              <div className="w-32">
                <Progress 
                  value={getCompletionPercentage()} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Menu Button */}
            <Button
              variant="outline"
              onClick={toggleModuleMenu}
              className="md:hidden"
            >
              📋 Módulos
            </Button>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso: {Math.round(getCompletionPercentage())}%</span>
              <span>💎 {userProfile.neurotokens} Neurotokens</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>
        </div>
      </header>

      {/* Module Menu Overlay */}
      <AnimatePresence>
        {showModuleMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModuleMenu(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white h-full w-80 max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-nucleo-purple">
                  Módulos de Aprendizaje
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Selecciona un módulo para continuar
                </p>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {modules.map((module, index) => {
                  const progress = moduleProgress[index];
                  const isUnlocked = true; // Allow access to all 6 modules
                  const isCurrent = index === currentModule;
                  
                  return (
                    <Card
                      key={module.id}
                      className={`p-4 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-nucleo-purple bg-nucleo-purple/5'
                          : isUnlocked
                          ? 'hover:border-gray-300'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => isUnlocked && handleModuleChange(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{module.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">
                              {module.name}
                            </h3>
                            {progress?.completed && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Completado
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {module.estimatedTime} min • {module.difficulty}
                          </div>
                          {progress?.score > 0 && (
                            <div className="text-xs text-nucleo-purple mt-1">
                              Puntuación: {progress.score}/{progress.maxScore}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="p-4 border-t bg-gray-50">
                <div className="text-xs text-center text-gray-600">
                  Completa los módulos en orden para desbloquear nuevos contenidos
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!isTransitioning && CurrentModuleComponent && (
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CurrentModuleComponent
                onComplete={handleModuleComplete}
                moduleData={currentModuleData}
                userProfile={userProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Module Navigation (Desktop) */}
        <div className="hidden md:block fixed bottom-6 right-6">
          <div className="bg-white rounded-2xl shadow-lg border p-4">
            <div className="grid grid-cols-3 gap-2">
              {modules.map((module, index) => {
                const progress = moduleProgress[index];
                const isUnlocked = true; // Allow access to all 6 modules
                const isCurrent = index === currentModule;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => isUnlocked && handleModuleChange(index)}
                    disabled={!isUnlocked}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                      isCurrent
                        ? 'bg-nucleo-purple text-white'
                        : progress?.completed
                        ? 'bg-nucleo-yellow text-nucleo-black'
                        : isUnlocked
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                    title={module.name}
                  >
                    {progress?.completed ? '✓' : module.icon}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
