import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ConcentricCircles } from '../nucleo-identity/ConcentricCircles';
import { ConnectiveLines } from '../nucleo-identity/ConnectiveLines';

interface Module1Props {
  onComplete: (score: number, achievements: string[], creations: any[], decisions: any[]) => void;
  moduleData: any;
  userProfile: any;
}

export const Module1Fundamentals: React.FC<Module1Props> = ({ 
  onComplete, 
  moduleData, 
  userProfile 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationData, setSimulationData] = useState<any[]>([]);

  const sections = [
    {
      id: 'introduction',
      title: '¿Qué es la Inteligencia Artificial?',
      description: 'Descubre los conceptos fundamentales de la IA',
      icon: '🧠',
      estimatedTime: 3
    },
    {
      id: 'types',
      title: 'Tipos de IA',
      description: 'Supervisada, No Supervisada y Reforzamiento',
      icon: '🎯',
      estimatedTime: 3
    },
    {
      id: 'simulation',
      title: 'Simulador de Entrenamiento',
      description: 'Entrena tu primera IA virtual',
      icon: '⚡',
      estimatedTime: 3
    }
  ];

  // AI training simulation data
  const trainingScenarios = [
    {
      id: 'image-classifier',
      name: 'Clasificador de Imágenes',
      description: 'Entrenar una IA para reconocer objetos cotidianos',
      dataTypes: ['Fotos de gatos', 'Fotos de perros', 'Fotos de carros', 'Fotos de flores'],
      expectedAccuracy: 85,
      trainingTime: 30
    },
    {
      id: 'sentiment-analyzer',
      name: 'Analizador de Sentimientos',
      description: 'IA que detecta emociones en texto',
      dataTypes: ['Comentarios positivos', 'Comentarios negativos', 'Comentarios neutrales'],
      expectedAccuracy: 78,
      trainingTime: 25
    },
    {
      id: 'music-recommender',
      name: 'Recomendador Musical',
      description: 'Sistema que sugiere música según preferencias',
      dataTypes: ['Historial de reproducción', 'Géneros preferidos', 'Hora del día', 'Estado de ánimo'],
      expectedAccuracy: 72,
      trainingTime: 35
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState(trainingScenarios[0]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);

  // Start AI training simulation
  const startTrainingSimulation = () => {
    setIsSimulationRunning(true);
    setTrainingProgress(0);
    setCurrentAccuracy(0);
    
    const duration = selectedScenario.trainingTime * 100; // Convert to ms for animation
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setTrainingProgress(progress);
      
      // Simulate accuracy improvement with some randomness
      const targetAccuracy = selectedScenario.expectedAccuracy;
      const currentAcc = Math.min(
        targetAccuracy, 
        Math.floor((progress / 100) * targetAccuracy + Math.random() * 10)
      );
      setCurrentAccuracy(currentAcc);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsSimulationRunning(false);
        setCurrentAccuracy(targetAccuracy);
        
        // Add simulation data for scoring
        const newSimData = {
          scenario: selectedScenario.id,
          finalAccuracy: targetAccuracy,
          timeToComplete: selectedScenario.trainingTime,
          timestamp: new Date()
        };
        setSimulationData(prev => [...prev, newSimData]);
        
        // Award points
        const points = Math.floor(targetAccuracy * 2);
        setScore(prev => prev + points);
        
        // Check for achievements
        if (targetAccuracy > 80) {
          setAchievements(prev => [...prev, 'high-accuracy-trainer']);
        }
      }
    }, interval);
  };

  // Handle quiz responses
  const handleQuizResponse = (questionId: string, answer: string, isCorrect: boolean) => {
    const response = { questionId, answer, isCorrect, timestamp: new Date() };
    setUserResponses(prev => [...prev, response]);
    
    if (isCorrect) {
      setScore(prev => prev + 20);
    }
  };

  // Navigate sections
  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setSectionProgress(0);
    } else {
      // Module complete
      const finalScore = score;
      const moduleAchievements = [...achievements];
      
      // Check completion achievements
      if (simulationData.length >= 2) {
        moduleAchievements.push('simulation-master');
      }
      if (finalScore > 200) {
        moduleAchievements.push('fundamentals-expert');
      }
      
      onComplete(finalScore, moduleAchievements, [], []);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  // Section progress tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sectionProgress < 100) {
        setSectionProgress(prev => Math.min(100, prev + 2));
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [sectionProgress]);

  const currentSectionData = sections[currentSection];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-4">
          <ConcentricCircles size="lg" color="purple" animated={true} />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nucleo-purple font-montserrat">
              Fundamentos de IA Interactivos
            </h1>
            <p className="text-lg text-gray-600 font-lora">
              Laboratorio completo de tipos de IA con simulaciones reales
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{score}</div>
            <div className="text-sm text-gray-600">Puntos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{achievements.length}</div>
            <div className="text-sm text-gray-600">Logros</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{currentSection + 1}/{sections.length}</div>
            <div className="text-sm text-gray-600">Sección</div>
          </div>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <span className="text-2xl">{currentSectionData.icon}</span>
            <span>{currentSectionData.title}</span>
          </h2>
          <Badge variant="secondary">
            {currentSectionData.estimatedTime} min
          </Badge>
        </div>
        <Progress value={(currentSection / sections.length) * 100} className="mb-2" />
        <div className="text-sm text-gray-600">
          {currentSectionData.description}
        </div>
      </Card>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {currentSection === 0 && (
            <div className="space-y-6">
              {/* Introduction Section */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                  ¡Bienvenido al mundo de la IA! 🌟
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-lg font-lora leading-relaxed">
                      La <strong>Inteligencia Artificial</strong> es como enseñar a las máquinas 
                      a pensar y tomar decisiones, similar a como los humanos aprenden de la experiencia.
                    </p>
                    
                    <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-nucleo-purple mb-2">
                        🤔 ¿Cómo funciona?
                      </h4>
                      <p className="text-sm">
                        Imagina que le enseñas a un niño a reconocer perros mostrándole 
                        miles de fotos. La IA hace lo mismo: aprende patrones de grandes 
                        cantidades de datos para hacer predicciones.
                      </p>
                    </div>

                    <div className="bg-nucleo-green/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-nucleo-purple mb-2">
                        🌍 IA Global
                      </h4>
                      <p className="text-sm">
                        En nuestra ciudad, la IA ya mejora el transporte público, 
                        ayuda en medicina y potencia startups globales en ecosistemas como Silicon Valley y Tel Aviv.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ConnectiveLines
                      width={300}
                      height={250}
                      nodeCount={8}
                      color="purple"
                      animated={true}
                      showDataFlow={true}
                    />
                  </div>
                </div>

                {/* Interactive Quiz */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold">🧩 Mini Quiz: Conceptos Básicos</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h5 className="font-medium mb-2">
                        ¿Cuál de estos es un ejemplo de IA en tu día a día?
                      </h5>
                      <div className="space-y-2">
                        {[
                          { text: 'Calculadora', correct: false },
                          { text: 'Netflix recomendando series', correct: true },
                          { text: 'Reproductor de música', correct: false }
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuizResponse('q1', option.text, option.correct)}
                            className="w-full text-left p-2 rounded border hover:bg-gray-50 transition-colors"
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h5 className="font-medium mb-2">
                        ¿Qué necesita la IA para aprender?
                      </h5>
                      <div className="space-y-2">
                        {[
                          { text: 'Solo programación', correct: false },
                          { text: 'Datos y algoritmos', correct: true },
                          { text: 'Internet rápido', correct: false }
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuizResponse('q2', option.text, option.correct)}
                            className="w-full text-left p-2 rounded border hover:bg-gray-50 transition-colors"
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentSection === 1 && (
            <div className="space-y-6">
              {/* Types of AI Section */}
              <Tabs defaultValue="supervised" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="supervised">🎯 Supervisado</TabsTrigger>
                  <TabsTrigger value="unsupervised">🔍 No Supervisado</TabsTrigger>
                  <TabsTrigger value="reinforcement">🎮 Reforzamiento</TabsTrigger>
                </TabsList>

                <TabsContent value="supervised">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-nucleo-purple mb-4">
                      Aprendizaje Supervisado 🎯
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="mb-4">
                          Es como aprender con un profesor que te dice si tu respuesta 
                          es correcta o incorrecta.
                        </p>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded">
                            <strong>Ejemplo:</strong> Clasificar correos como spam o no spam
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <strong>Datos necesarios:</strong> Miles de correos ya etiquetados
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <strong>Resultado:</strong> Sistema que detecta spam automáticamente
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-6xl mb-4">📧</div>
                        <div className="text-sm text-gray-600">
                          Spam ❌ → No Spam ✅
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="unsupervised">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-nucleo-purple mb-4">
                      Aprendizaje No Supervisado 🔍
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="mb-4">
                          La IA encuentra patrones por sí sola, sin que nadie le diga 
                          qué buscar.
                        </p>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded">
                            <strong>Ejemplo:</strong> Agrupar clientes por comportamiento
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <strong>Datos necesarios:</strong> Información de compras sin categorías
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <strong>Resultado:</strong> Descubre grupos de clientes similares
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎭</div>
                        <div className="text-sm text-gray-600">
                          Encuentra patrones ocultos
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="reinforcement">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-nucleo-purple mb-4">
                      Aprendizaje por Reforzamiento 🎮
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="mb-4">
                          Como entrenar una mascota: premios por buenas acciones, 
                          consecuencias por malas decisiones.
                        </p>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded">
                            <strong>Ejemplo:</strong> IA que juega ajedrez
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <strong>Método:</strong> Gana puntos por victorias, pierde por derrotas
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <strong>Resultado:</strong> Mejora jugando millones de partidas
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-6xl mb-4">♟️</div>
                        <div className="text-sm text-gray-600">
                          Aprende por ensayo y error
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentSection === 2 && (
            <div className="space-y-6">
              {/* AI Training Simulator */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                  🚀 Simulador de Entrenamiento IA
                </h3>
                <p className="text-gray-600 mb-6">
                  ¡Hora de entrenar tu primera IA! Elige un escenario y observa cómo aprende.
                </p>

                {/* Scenario Selection */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {trainingScenarios.map((scenario) => (
                    <Card
                      key={scenario.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedScenario.id === scenario.id
                          ? 'border-nucleo-purple bg-nucleo-purple/5'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <h4 className="font-semibold mb-2">{scenario.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <div className="text-xs space-y-1">
                        <div>⏱️ {scenario.trainingTime}s de entrenamiento</div>
                        <div>🎯 {scenario.expectedAccuracy}% precisión esperada</div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Training Interface */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">
                    Entrenando: {selectedScenario.name}
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Datos de entrenamiento:</h5>
                      <div className="space-y-2">
                        {selectedScenario.dataTypes.map((dataType, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-nucleo-purple rounded-full"></div>
                            <span className="text-sm">{dataType}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso de entrenamiento</span>
                            <span>{Math.round(trainingProgress)}%</span>
                          </div>
                          <Progress value={trainingProgress} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Precisión actual</span>
                            <span className="text-nucleo-purple font-semibold">
                              {currentAccuracy}%
                            </span>
                          </div>
                          <Progress value={currentAccuracy} className="bg-green-100" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      onClick={startTrainingSimulation}
                      disabled={isSimulationRunning}
                      className="bg-nucleo-purple hover:bg-nucleo-violet text-white px-8 py-3"
                    >
                      {isSimulationRunning ? '⚡ Entrenando...' : '🚀 Iniciar Entrenamiento'}
                    </Button>
                  </div>

                  {simulationData.length > 0 && (
                    <div className="mt-6 p-4 bg-white rounded border">
                      <h5 className="font-semibold mb-2">📊 Resultados de entrenamiento:</h5>
                      {simulationData.map((sim, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {trainingScenarios.find(s => s.id === sim.scenario)?.name}: {sim.finalAccuracy}% precisión
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 0}
        >
          ← Anterior
        </Button>

        <div className="text-center">
          <Progress value={sectionProgress} className="w-32 mx-auto mb-2" />
          <div className="text-sm text-gray-600">
            Progreso de sección: {Math.round(sectionProgress)}%
          </div>
        </div>

        <Button
          onClick={nextSection}
          className="bg-nucleo-purple hover:bg-nucleo-violet text-white"
          disabled={currentSection === 2 && simulationData.length === 0}
        >
          {currentSection === sections.length - 1 ? '🏆 Completar Módulo' : 'Siguiente →'}
        </Button>
      </div>

      {/* Achievements Display */}
      {achievements.length > 0 && (
        <Card className="p-4 bg-nucleo-yellow/10 border-nucleo-yellow">
          <h4 className="font-semibold text-nucleo-purple mb-2">🏆 Logros desbloqueados:</h4>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <Badge key={index} variant="secondary" className="bg-nucleo-yellow text-nucleo-black">
                {achievement === 'high-accuracy-trainer' && '🎯 Entrenador Preciso'}
                {achievement === 'simulation-master' && '⚡ Maestro de Simulaciones'}
                {achievement === 'fundamentals-expert' && '🧠 Experto en Fundamentos'}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
