import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ConcentricCircles } from '../nucleo-identity/ConcentricCircles';

interface Module3Props {
  onComplete: (score: number, achievements: string[], creations: any[], decisions: any[]) => void;
  moduleData: any;
  userProfile: any;
}

export const Module3ComputerVision: React.FC<Module3Props> = ({ 
  onComplete, 
  moduleData, 
  userProfile 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [score, setScore] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<Array<{name: string, confidence: number}>>([]);
  const [imageClassification, setImageClassification] = useState<{label: string, confidence: number} | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [creations, setCreations] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'sepia' | 'vintage' | 'cyberpunk' | 'none'>('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sections = [
    { id: 'intro', title: '¿Cómo ven las máquinas?', time: 1 },
    { id: 'recognition', title: 'Reconocimiento de Objetos', time: 1 },
    { id: 'filters', title: 'Filtros Inteligentes', time: 1 }
  ];

  // Predefined images for classification demo
  const demoImages = [
    {
      url: '/api/placeholder/300/200',
      name: 'paisaje_tokyo.jpg',
      description: 'Paisaje de Tokio',
      classification: { label: 'Ciudad', confidence: 0.94 },
      objects: [
        { name: 'Edificios', confidence: 0.92 },
        { name: 'Montañas', confidence: 0.88 },
        { name: 'Cielo', confidence: 0.96 }
      ]
    },
    {
      url: '/api/placeholder/300/200',
      name: 'street_food_global.jpg',
      description: 'Street food mundial',
      classification: { label: 'Comida', confidence: 0.91 },
      objects: [
        { name: 'Taza', confidence: 0.95 },
        { name: 'Café', confidence: 0.89 },
        { name: 'Mesa', confidence: 0.87 }
      ]
    },
    {
      url: '/api/placeholder/300/200',
      name: 'smart_transport.jpg',
      description: 'Transporte inteligente',
      classification: { label: 'Transporte', confidence: 0.96 },
      objects: [
        { name: 'Tren', confidence: 0.98 },
        { name: 'Estación', confidence: 0.93 },
        { name: 'Personas', confidence: 0.85 }
      ]
    }
  ];

  const simulateObjectDetection = (imageIndex: number) => {
    const image = demoImages[imageIndex];
    setDetectedObjects(image.objects);
    setImageClassification(image.classification);
    setScore(prev => prev + 25);
    
    if (!achievements.includes('object-detector')) {
      setAchievements(prev => [...prev, 'object-detector']);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // Module complete
      const finalCreations = creations.length > 0 ? creations : [{
        id: crypto.randomUUID(),
        type: 'vision-analysis',
        title: `Análisis Visual - ${userProfile.name}`,
        description: `Reconocimiento de objetos y clasificación de imágenes`,
        data: { detectedObjects, imageClassification, filterUsed: filterType },
        thumbnail: '👁️',
        tags: ['computer-vision', 'object-detection', 'image-classification'],
        isPublic: true,
        createdAt: new Date()
      }];
      
      const finalAchievements = [...achievements];
      if (detectedObjects.length > 0) finalAchievements.push('vision-expert');
      if (filterType !== 'none') finalAchievements.push('filter-artist');
      
      onComplete(score, finalAchievements, finalCreations, []);
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
          <ConcentricCircles size="lg" color="yellow" animated={true} />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nucleo-purple font-montserrat">
              Visión por Computadora
            </h1>
            <p className="text-lg text-gray-600 font-lora">
              Enseña a las máquinas a "ver" y comprender imágenes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{score}</div>
            <div className="text-sm text-gray-600">Puntos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{detectedObjects.length}</div>
            <div className="text-sm text-gray-600">Objetos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{achievements.length}</div>
            <div className="text-sm text-gray-600">Logros</div>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {sections[currentSection].title}
          </h2>
          <Badge variant="secondary">{sections[currentSection].time} min</Badge>
        </div>
        <Progress value={(currentSection / sections.length) * 100} />
      </Card>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {currentSection === 0 && (
            <Card className="p-6">
              <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                👁️ ¿Cómo aprenden las máquinas a ver?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="font-lora leading-relaxed">
                    La <strong>Visión por Computadora</strong> es la tecnología que permite 
                    a las máquinas interpretar y entender el contenido visual del mundo, 
                    como imágenes y videos.
                  </p>
                  
                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-nucleo-purple mb-2">🧠 Proceso de "visión":</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li><strong>Captura:</strong> La cámara toma una imagen</li>
                      <li><strong>Digitalización:</strong> Convierte en píxeles con valores</li>
                      <li><strong>Procesamiento:</strong> Analiza patrones y formas</li>
                      <li><strong>Reconocimiento:</strong> Identifica objetos y características</li>
                      <li><strong>Interpretación:</strong> Entiende el contexto y significado</li>
                    </ol>
                  </div>

                  <div className="bg-nucleo-green/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-nucleo-purple mb-2">🌍 A Nivel Global</h4>
                    <p className="text-sm">
                      Los sistemas de transporte de Singapur y Helsinki usan visión por computadora para optimizar flujos de pasajeros 
                      automáticamente y optimizar el servicio. Los semáforos inteligentes 
                      detectan tráfico en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">🔍 Aplicaciones de la Visión por Computadora:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">📱</span>
                      <div>
                        <div className="font-medium text-sm">Reconocimiento facial</div>
                        <div className="text-xs text-gray-600">Desbloqueo de teléfonos</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🚗</span>
                      <div>
                        <div className="font-medium text-sm">Vehículos autónomos</div>
                        <div className="text-xs text-gray-600">Detectar peatones y señales</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🏥</span>
                      <div>
                        <div className="font-medium text-sm">Diagnóstico médico</div>
                        <div className="text-xs text-gray-600">Análisis de rayos X</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🛒</span>
                      <div>
                        <div className="font-medium text-sm">Compras inteligentes</div>
                        <div className="text-xs text-gray-600">Buscar productos por foto</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <div className="font-medium text-sm">Arte y creatividad</div>
                        <div className="text-xs text-gray-600">Filtros de realidad aumentada</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentSection === 1 && (
            <Card className="p-6">
              <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                🔍 Laboratorio de Reconocimiento de Objetos
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📸 Selecciona una imagen para analizar:</h4>
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {demoImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(image.name);
                          simulateObjectDetection(index);
                        }}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          selectedImage === image.name
                            ? 'border-nucleo-purple bg-nucleo-purple/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-nucleo-yellow to-nucleo-purple rounded flex items-center justify-center text-white font-bold">
                            {image.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{image.description}</div>
                            <div className="text-sm text-gray-600">{image.name}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedImage && (
                    <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-nucleo-purple mb-2">🎯 Cómo funciona:</h5>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>La IA divide la imagen en regiones</li>
                        <li>Analiza formas, colores y texturas</li>
                        <li>Compara con millones de ejemplos</li>
                        <li>Asigna probabilidades a cada objeto</li>
                        <li>Muestra los resultados más confiables</li>
                      </ol>
                    </div>
                  )}
                </div>

                <div>
                  {imageClassification && (
                    <div className="space-y-4">
                      <div className="bg-white border rounded-lg p-4">
                        <h5 className="font-semibold text-nucleo-purple mb-3">🏷️ Clasificación General:</h5>
                        <div className="flex items-center justify-between p-3 bg-nucleo-green/10 rounded border">
                          <span className="font-medium">{imageClassification.label}</span>
                          <span className="text-lg font-bold text-nucleo-purple">
                            {(imageClassification.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-4">
                        <h5 className="font-semibold text-nucleo-purple mb-3">🎯 Objetos Detectados:</h5>
                        <div className="space-y-2">
                          {detectedObjects.map((object, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm font-medium">{object.name}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-nucleo-purple h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${object.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold">
                                  {(object.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-nucleo-purple/10 p-4 rounded-lg">
                        <h5 className="font-semibold text-nucleo-purple mb-2">💡 ¿Sabías que?</h5>
                        <p className="text-sm">
                          Los porcentajes representan la "confianza" de la IA. Un 94% significa 
                          que está muy segura, pero nunca es 100% porque la IA siempre considera 
                          la posibilidad de error.
                        </p>
                      </div>
                    </div>
                  )}

                  {!selectedImage && (
                    <div className="text-center text-gray-500 py-12">
                      <div className="text-4xl mb-2">📸</div>
                      <div>Selecciona una imagen para ver la magia de la IA</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {currentSection === 2 && (
            <Card className="p-6">
              <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                🎨 Estudio de Filtros Inteligentes
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🎛️ Selecciona un filtro:</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {([
                      { id: 'none', name: 'Original', emoji: '📷' },
                      { id: 'sepia', name: 'Sepia', emoji: '📜' },
                      { id: 'vintage', name: 'Vintage', emoji: '📸' },
                      { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖' }
                    ] as const).map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          setFilterType(filter.id);
                          setScore(prev => prev + 10);
                        }}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          filterType === filter.id
                            ? 'border-nucleo-purple bg-nucleo-purple/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{filter.emoji}</div>
                        <div className="text-sm font-medium">{filter.name}</div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <h5 className="font-semibold text-nucleo-purple mb-2">🔬 Cómo funcionan los filtros:</h5>
                    <p className="text-sm mb-2">
                      Los filtros inteligentes modifican los valores de color de cada píxel 
                      usando algoritmos matemáticos para crear efectos visuales.
                    </p>
                    <div className="text-xs text-gray-600">
                      <strong>Sepia:</strong> Convierte colores a tonos cálidos (marrón/dorado)<br/>
                      <strong>Vintage:</strong> Reduce saturación y añade tinte cálido<br/>
                      <strong>Cyberpunk:</strong> Intensifica azules y reduce rojos
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">🖼️ Vista previa:</h4>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="h-48 bg-gradient-to-br from-nucleo-yellow via-nucleo-purple to-nucleo-violet flex items-center justify-center relative">
                      <div className={`text-white text-center transition-all duration-300 ${
                        filterType === 'sepia' ? 'sepia' :
                        filterType === 'vintage' ? 'contrast-75 saturate-75' :
                        filterType === 'cyberpunk' ? 'hue-rotate-180 saturate-150' : ''
                      }`}>
                        <div className="text-6xl mb-2">🏙️</div>
                        <div className="text-lg font-bold">Global Smart Cities</div>
                        <div className="text-sm opacity-75">Con filtro: {filterType}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50">
                      <div className="text-sm font-medium">Filtro aplicado: {filterType}</div>
                      <div className="text-xs text-gray-600">
                        Procesamiento de imagen en tiempo real
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="bg-white border rounded-lg p-3">
                      <div className="font-medium text-sm">🚀 Aplicaciones reales:</div>
                      <div className="text-xs text-gray-600 mt-1">
                        • Instagram, TikTok: Filtros de belleza y efectos<br/>
                        • Snapchat: Realidad aumentada con reconocimiento facial<br/>
                        • Apps médicas: Mejora de imágenes de rayos X<br/>
                        • Fotografía: Corrección automática de color y luz
                      </div>
                    </div>

                    <div className="bg-nucleo-green/10 p-3 rounded-lg">
                      <div className="font-medium text-nucleo-purple text-sm">🌍 A Nivel Global:</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Startups como "Karisma Labs" desarrollan filtros de RA 
                        para mostrar la transformación urbana de la ciudad.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
          disabled={currentSection === 0}
        >
          ← Anterior
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Sección {currentSection + 1} de {sections.length}
          </div>
        </div>

        <Button
          onClick={nextSection}
          className="bg-nucleo-yellow hover:bg-yellow-400 text-nucleo-black"
        >
          {currentSection === sections.length - 1 ? '🏆 Completar Módulo' : 'Siguiente →'}
        </Button>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="p-4 bg-nucleo-yellow/10 border-nucleo-yellow">
          <h4 className="font-semibold text-nucleo-purple mb-2">🏆 Logros desbloqueados:</h4>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <Badge key={index} variant="secondary" className="bg-nucleo-yellow text-nucleo-black">
                {achievement === 'object-detector' && '🔍 Detector de Objetos'}
                {achievement === 'vision-expert' && '👁️ Experto en Visión'}
                {achievement === 'filter-artist' && '🎨 Artista de Filtros'}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
