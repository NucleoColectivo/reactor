import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ConcentricCircles } from '../nucleo-identity/ConcentricCircles';
import { ConnectiveLines } from '../nucleo-identity/ConnectiveLines';

interface Module5Props {
  onComplete: (score: number, achievements: string[], creations: any[], decisions: any[]) => void;
  moduleData: any;
  userProfile: any;
}

export const Module5NeuralNetworks: React.FC<Module5Props> = ({ 
  onComplete, 
  moduleData, 
  userProfile 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [selectedArchitecture, setSelectedArchitecture] = useState('cnn');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationData, setSimulationData] = useState<any>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sections = [
    {
      id: 'fundamentals',
      title: 'Fundamentos de Redes Neuronales',
      description: 'Comprende la estructura básica de las neuronas artificiales',
      icon: '🧠',
      estimatedTime: 4
    },
    {
      id: 'architectures',
      title: 'Arquitecturas Famosas',
      description: 'Explora CNN, LSTM, Transformers y más',
      icon: '🏗️',
      estimatedTime: 5
    },
    {
      id: 'simulator',
      title: 'Simulador 3D Interactivo',
      description: 'Construye y visualiza tu propia red neuronal',
      icon: '🕸️',
      estimatedTime: 6
    }
  ];

  const neuralArchitectures = [
    {
      id: 'cnn',
      name: 'CNN (Convolutional Neural Network)',
      description: 'Red neuronal convolucional para procesamiento de imágenes',
      layers: ['Input', 'Conv2D', 'MaxPool', 'Conv2D', 'MaxPool', 'Flatten', 'Dense', 'Output'],
      useCase: 'Reconocimiento de imágenes, clasificación de objetos',
      globalExample: 'Google Photos para categorización automática de fotos',
      accuracy: '95-99%',
      color: '#9D4EDD'
    },
    {
      id: 'lstm',
      name: 'LSTM (Long Short-Term Memory)',
      description: 'Red neuronal recurrente para secuencias temporales',
      layers: ['Input', 'LSTM', 'LSTM', 'Dropout', 'Dense', 'Output'],
      useCase: 'Procesamiento de lenguaje natural, predicción de series temporales',
      globalExample: 'Google Translate para traducción de texto',
      accuracy: '85-95%',
      color: '#FEE440'
    },
    {
      id: 'transformer',
      name: 'Transformer',
      description: 'Arquitectura de atención para procesamiento de lenguaje',
      layers: ['Input', 'Embedding', 'Multi-Head Attention', 'Feed Forward', 'Output'],
      useCase: 'Modelos de lenguaje, traducción automática',
      globalExample: 'ChatGPT y GPT-4 para generación de texto',
      accuracy: '90-98%',
      color: '#7B2CBF'
    },
    {
      id: 'resnet',
      name: 'ResNet (Residual Network)',
      description: 'Red con conexiones residuales para entrenar modelos muy profundos',
      layers: ['Input', 'Conv Block', 'Residual Block', 'Residual Block', 'Global Pool', 'Output'],
      useCase: 'Clasificación de imágenes, detección de objetos',
      globalExample: 'Microsoft Azure Computer Vision',
      accuracy: '92-96%',
      color: '#F72585'
    }
  ];

  // Simulate neural network training
  const startSimulation = () => {
    setSimulationRunning(true);
    setSectionProgress(0);
    
    const arch = neuralArchitectures.find(a => a.id === selectedArchitecture);
    if (!arch) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        setSimulationRunning(false);
        clearInterval(interval);
        
        // Award points for completing simulation
        setScore(prev => prev + 30);
        if (!achievements.includes('neural-architect')) {
          setAchievements(prev => [...prev, 'neural-architect']);
        }
      }
      setSectionProgress(progress);
      
      // Update simulation data
      setSimulationData({
        epochs: Math.floor(progress / 10),
        accuracy: Math.min(85 + (progress / 100) * 10, parseFloat(arch.accuracy.split('-')[1].replace('%', ''))),
        loss: Math.max(2.5 - (progress / 100) * 2.3, 0.2),
        learningRate: 0.001,
        architecture: arch.name
      });
    }, 200);
  };

  // Draw 3D-like network visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawNeuralNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const layers = [4, 6, 6, 3]; // neurons per layer
      const layerWidth = canvas.width / (layers.length + 1);
      const maxNeurons = Math.max(...layers);
      
      // Draw connections
      ctx.strokeStyle = '#9D4EDD40';
      ctx.lineWidth = 1;
      
      for (let l = 0; l < layers.length - 1; l++) {
        for (let n1 = 0; n1 < layers[l]; n1++) {
          for (let n2 = 0; n2 < layers[l + 1]; n2++) {
            const x1 = layerWidth * (l + 1);
            const y1 = (canvas.height / (layers[l] + 1)) * (n1 + 1);
            const x2 = layerWidth * (l + 2);
            const y2 = (canvas.height / (layers[l + 1] + 1)) * (n2 + 1);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
      
      // Draw neurons
      for (let l = 0; l < layers.length; l++) {
        for (let n = 0; n < layers[l]; n++) {
          const x = layerWidth * (l + 1);
          const y = (canvas.height / (layers[l] + 1)) * (n + 1);
          
          // Neuron circle with glow effect
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
          gradient.addColorStop(0, '#FEE440');
          gradient.addColorStop(1, '#9D4EDD');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fill();
          
          // Activation animation
          if (simulationRunning) {
            const pulse = Math.sin(Date.now() * 0.01 + l + n) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(254, 228, 64, ${pulse})`;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    drawNeuralNetwork();
    
    let animationId: number;
    if (simulationRunning) {
      const animate = () => {
        drawNeuralNetwork();
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [selectedArchitecture, simulationRunning]);

  const handleSectionComplete = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setScore(prev => prev + 25);
    } else {
      // Module complete
      const finalScore = score + 25;
      const finalAchievements = [...achievements, 'neural-networks-master'];
      onComplete(finalScore, finalAchievements, [], []);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-nucleo-purple mb-4">🧠 ¿Qué es una Neurona Artificial?</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Una neurona artificial es una unidad de procesamiento que recibe entradas, 
                    las procesa mediante pesos y sesgos, y produce una salida.
                  </p>
                  <div className="bg-nucleo-purple/10 p-4 rounded-lg">
                    <div className="font-semibold text-nucleo-purple mb-2">🌍 Impacto Global:</div>
                    <ul className="text-sm space-y-1">
                      <li>• DeepMind (Reino Unido): AlphaFold para predicción de proteínas</li>
                      <li>• OpenAI (EE.UU.): GPT revoluciona el procesamiento de lenguaje</li>
                      <li>• Baidu (China): Reconocimiento de voz en mandarín</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-nucleo-purple mb-4">🔗 Conexiones y Capas</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Las neuronas se organizan en capas: entrada, ocultas y salida. 
                    Cada conexión tiene un peso que determina su importancia.
                  </p>
                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <div className="font-semibold text-nucleo-purple mb-2">📊 Estadísticas Mundiales:</div>
                    <ul className="text-sm space-y-1">
                      <li>• GPT-4: ~1.76 billones de parámetros</li>
                      <li>• Cerebro humano: ~86 mil millones de neuronas</li>
                      <li>• ResNet-152: 152 capas profundas</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🎯 Funciones de Activación</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-semibold">ReLU</div>
                  <div className="text-sm text-gray-600">Rectified Linear Unit</div>
                  <div className="text-xs mt-2">Más común en CNN</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">〰️</div>
                  <div className="font-semibold">Sigmoid</div>
                  <div className="text-sm text-gray-600">Función logística</div>
                  <div className="text-xs mt-2">Salidas 0-1</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold">Tanh</div>
                  <div className="text-sm text-gray-600">Tangente hiperbólica</div>
                  <div className="text-xs mt-2">Salidas -1 a 1</div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🏗️ Arquitecturas Famosas Globales</h3>
              <Tabs value={selectedArchitecture} onValueChange={setSelectedArchitecture}>
                <TabsList className="grid w-full grid-cols-4">
                  {neuralArchitectures.map((arch) => (
                    <TabsTrigger key={arch.id} value={arch.id} className="text-xs">
                      {arch.id.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {neuralArchitectures.map((arch) => (
                  <TabsContent key={arch.id} value={arch.id} className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-nucleo-purple mb-3">{arch.name}</h4>
                        <p className="text-gray-700 mb-4">{arch.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="font-semibold text-sm">🎯 Caso de Uso:</div>
                            <div className="text-sm text-gray-600">{arch.useCase}</div>
                          </div>
                          
                          <div>
                            <div className="font-semibold text-sm">🌍 Ejemplo Global:</div>
                            <div className="text-sm text-gray-600">{arch.globalExample}</div>
                          </div>
                          
                          <div>
                            <div className="font-semibold text-sm">📊 Precisión Típica:</div>
                            <div className="text-sm text-gray-600">{arch.accuracy}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-sm mb-3">🔧 Capas de la Arquitectura:</div>
                        <div className="space-y-2">
                          {arch.layers.map((layer, index) => (
                            <div 
                              key={index}
                              className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                              style={{ borderLeft: `4px solid ${arch.color}` }}
                            >
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <div className="text-sm font-medium">{layer}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🌍 Líderes Mundiales en IA</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-700">🇺🇸 Silicon Valley</div>
                  <div className="text-sm text-gray-600 mt-2">Google, OpenAI, Meta</div>
                  <div className="text-xs mt-1">Transformers, LLMs, Computer Vision</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-700">🇬🇧 DeepMind (Londres)</div>
                  <div className="text-sm text-gray-600 mt-2">AlphaGo, AlphaFold</div>
                  <div className="text-xs mt-1">Reinforcement Learning, Protein Folding</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="font-semibold text-red-700">🇨🇳 Baidu, Tencent</div>
                  <div className="text-sm text-gray-600 mt-2">PaddlePaddle, WeChat AI</div>
                  <div className="text-xs mt-1">NLP chino, Computer Vision</div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🕸️ Simulador de Red Neuronal 3D</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Arquitectura Seleccionada:</label>
                    <select 
                      value={selectedArchitecture}
                      onChange={(e) => setSelectedArchitecture(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      {neuralArchitectures.map((arch) => (
                        <option key={arch.id} value={arch.id}>{arch.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={startSimulation}
                      disabled={simulationRunning}
                      className="w-full bg-nucleo-purple hover:bg-nucleo-violet text-white"
                    >
                      {simulationRunning ? '🔄 Entrenando...' : '🚀 Iniciar Entrenamiento'}
                    </Button>
                    
                    {simulationRunning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso:</span>
                          <span>{Math.round(sectionProgress)}%</span>
                        </div>
                        <Progress value={sectionProgress} className="h-3" />
                      </div>
                    )}
                    
                    {Object.keys(simulationData).length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold">📊 Métricas de Entrenamiento:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Época:</span> {simulationData.epochs}/10
                          </div>
                          <div>
                            <span className="font-medium">Precisión:</span> {simulationData.accuracy?.toFixed(1)}%
                          </div>
                          <div>
                            <span className="font-medium">Pérdida:</span> {simulationData.loss?.toFixed(3)}
                          </div>
                          <div>
                            <span className="font-medium">LR:</span> {simulationData.learningRate}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 text-sm font-semibold">Visualización 3D de la Red:</div>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className="border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Las neuronas se iluminan durante el entrenamiento simulado
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🎓 Casos de Éxito Mundiales</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-700 mb-2">🏥 Healthcare Global</div>
                  <p className="text-sm text-gray-700">
                    IBM Watson (EE.UU.) analiza imágenes médicas con precisión del 96%, 
                    mientras que Babylon Health (Reino Unido) usa redes neuronales para diagnósticos preliminares.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-700 mb-2">🚗 Vehículos Autónomos</div>
                  <p className="text-sm text-gray-700">
                    Tesla (EE.UU.) usa CNN para visión computacional, Waymo (Google) combina LSTM para predicción de trayectorias, 
                    y BYD (China) implementa redes neuronales para sistemas de asistencia al conductor.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-700 mb-2">🌐 Traducción Global</div>
                  <p className="text-sm text-gray-700">
                    Google Translate usa Transformers para 100+ idiomas, DeepL (Alemania) alcanza 99% de precisión 
                    en traducción europea, y Microsoft Translator integra LSTM para contexto conversacional.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-4">
          <ConcentricCircles size="lg" color="purple" animated={true} />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nucleo-purple font-montserrat">
              Redes Neuronales 3D Inmersivas
            </h1>
            <p className="text-lg text-gray-600 font-lora">
              Constructor interactivo con arquitecturas famosas mundiales
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-nucleo-purple">
            {sections[currentSection].title}
          </h2>
          <Badge variant="secondary">
            Sección {currentSection + 1}/{sections.length}
          </Badge>
        </div>
        <p className="text-gray-600 mb-4">{sections[currentSection].description}</p>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Progress value={((currentSection + 1) / sections.length) * 100} className="h-2" />
          </div>
          <div className="text-sm text-gray-600">
            ~{sections[currentSection].estimatedTime} min
          </div>
        </div>
      </Card>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderCurrentSection()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Puntuación actual: <span className="font-bold text-nucleo-purple">{score} puntos</span>
          </div>
          <Button
            onClick={handleSectionComplete}
            className="bg-nucleo-purple hover:bg-nucleo-violet text-white"
          >
            {currentSection < sections.length - 1 ? 'Siguiente Sección' : 'Completar Módulo'} →
          </Button>
        </div>
        
        {achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-semibold text-nucleo-purple mb-2">🏆 Logros Desbloqueados:</div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {achievement === 'neural-architect' ? '🧠 Arquitecto Neural' : achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
        <ConnectiveLines />
      </div>
    </div>
  );
};
