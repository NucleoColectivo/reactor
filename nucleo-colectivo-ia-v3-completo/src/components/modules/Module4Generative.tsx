import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { ConcentricCircles } from '../nucleo-identity/ConcentricCircles';

interface Module4Props {
  onComplete: (score: number, achievements: string[], creations: any[], decisions: any[]) => void;
  moduleData: any;
  userProfile: any;
}

export const Module4Generative: React.FC<Module4Props> = ({ 
  onComplete, 
  moduleData, 
  userProfile 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [score, setScore] = useState(0);
  const [creations, setCreations] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Art Generator Parameters
  const [artParams, setArtParams] = useState({
    algorithm: 'fractal',
    colors: 'global',
    complexity: 50,
    randomness: 30,
    style: 'abstract'
  });

  // Text Generator
  const [textPrompt, setTextPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [textStyle, setTextStyle] = useState<'poetic' | 'technical' | 'casual'>('poetic');

  // Music Generator
  const [musicParams, setMusicParams] = useState({
    genre: 'cumbia-tech',
    tempo: 120,
    instruments: ['synth', 'percussion'],
    mood: 'celebratory'
  });

  const [currentArt, setCurrentArt] = useState<string>('');

  const sections = [
    { id: 'intro', title: '¿Qué es la IA Generativa?', time: 1 },
    { id: 'visual', title: 'Arte Visual Generativo', time: 1 },
    { id: 'multimodal', title: 'Creación Multimodal', time: 1 }
  ];

  // Color palettes inspired by global cultures
  const colorPalettes = {
    global: ['#FEE440', '#9D4EDD', '#7B2CBF', '#F72585', '#4361EE'],
    tech: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    innovation: ['#FFA726', '#AB47BC', '#26A69A', '#42A5F5', '#66BB6A'],
    natura: ['#8BC34A', '#4CAF50', '#009688', '#00BCD4', '#03A9F4']
  };

  // Algorithms for generative art
  const algorithms = {
    fractal: (ctx: CanvasRenderingContext2D, params: any) => {
      const colors = colorPalettes[params.colors as keyof typeof colorPalettes];
      const complexity = params.complexity / 100;
      const randomness = params.randomness / 100;
      
      // Generate fractal-like pattern
      for (let i = 0; i < 200 * complexity; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        const size = 5 + Math.random() * 20 * randomness;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.fillStyle = color + '80'; // Semi-transparent
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add connecting lines
        if (Math.random() < 0.3) {
          const x2 = x + (Math.random() - 0.5) * 100;
          const y2 = y + (Math.random() - 0.5) * 100;
          ctx.strokeStyle = color + '40';
          ctx.lineWidth = Math.random() * 3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    },
    neural: (ctx: CanvasRenderingContext2D, params: any) => {
      const colors = colorPalettes[params.colors as keyof typeof colorPalettes];
      const complexity = params.complexity / 100;
      
      // Generate neural network-like visualization
      const nodes = Array.from({ length: Math.floor(20 * complexity) }, () => ({
        x: Math.random() * 400,
        y: Math.random() * 300,
        connections: Math.floor(Math.random() * 5) + 1
      }));
      
      // Draw connections
      nodes.forEach(node => {
        for (let i = 0; i < node.connections; i++) {
          const target = nodes[Math.floor(Math.random() * nodes.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          ctx.strokeStyle = color + '60';
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    geometric: (ctx: CanvasRenderingContext2D, params: any) => {
      const colors = colorPalettes[params.colors as keyof typeof colorPalettes];
      const complexity = params.complexity / 100;
      const randomness = params.randomness / 100;
      
      // Generate geometric patterns
      for (let i = 0; i < 50 * complexity; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        const size = 10 + Math.random() * 50 * randomness;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.floor(Math.random() * 3);
        
        ctx.fillStyle = color + '90';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        if (shape === 0) {
          // Rectangle
          ctx.fillRect(x - size/2, y - size/2, size, size);
        } else if (shape === 1) {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(x, y - size/2);
          ctx.lineTo(x - size/2, y + size/2);
          ctx.lineTo(x + size/2, y + size/2);
          ctx.closePath();
          ctx.fill();
        } else {
          // Circle
          ctx.beginPath();
          ctx.arc(x, y, size/2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const generateArt = () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate art using selected algorithm
    const algorithm = algorithms[artParams.algorithm as keyof typeof algorithms];
    algorithm(ctx, artParams);
    
    // Save creation
    const artData = canvas.toDataURL();
    const newCreation = {
      id: crypto.randomUUID(),
      type: 'generative-art',
      title: `Arte ${artParams.algorithm} - ${userProfile.name}`,
      description: `Creado con algoritmo ${artParams.algorithm}, paleta ${artParams.colors}`,
      data: { artData, params: { ...artParams } },
      thumbnail: '🎨',
      tags: ['generative-art', artParams.algorithm, artParams.colors],
      isPublic: true,
      createdAt: new Date()
    };
    
    setCreations(prev => [...prev, newCreation]);
    setCurrentArt(artData);
    setScore(prev => prev + 20);
    
    if (!achievements.includes('digital-artist')) {
      setAchievements(prev => [...prev, 'digital-artist']);
    }
    
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const generateText = () => {
    const prompts = {
      poetic: [
        `En las ciudades inteligentes del mundo, donde la tecnología abraza la diversidad cultural, ${textPrompt || 'la inteligencia artificial'} florece como una nueva sinfonía que conecta continentes, uniendo corazones y mentes con redes digitales de esperanza global.`,
        `Como el té chai que despierta la inspiración global, ${textPrompt || 'la creatividad digital'} se derrama por las avenidas virtuales de la innovación mundial, donde cada algoritmo cuenta historias de transformación intercultural y cada línea de código susurra secretos del futuro compartido.`,
        `En el valle de la eterna primavera, ${textPrompt || 'la inteligencia artificial'} baila al ritmo de la cumbia y el vallenato, creando sinfonías de datos que pintan arcoíris de posibilidades en el cielo azul de la imaginación.`
      ],
      technical: [
        `${textPrompt || 'La implementación de IA'} en ecosistemas tecnológicos globales como Silicon Valley, Shenzhen y Tel Aviv utiliza arquitecturas de redes neuronales profundas optimizadas para el procesamiento distribuido, mejorando la eficiencia computacional en un 340% comparado con métodos tradicionales.`,
        `Los algoritmos de aprendizaje automático para ${textPrompt || 'análisis predictivo'} emplean técnicas de ensemble learning y gradient boosting, procesando datasets con más de 10TB de información estructurada y no estructurada del ecosistema urbano.`,
        `La infraestructura de IA para ${textPrompt || 'ciudad inteligente'} integra sensores IoT, procesamiento edge computing y cloud híbrido, generando insights en tiempo real con latencia menor a 100ms para la toma de decisiones urbanas.`
      ],
      casual: [
        `¡Hey! ¿Sabías que? ${textPrompt || 'La inteligencia artificial'} está revolucionando el mundo entero. Imagínate que ya podemos hacer cosas increíbles que antes solo veíamos en películas de ciencia ficción. ¡Es fascinante cómo la tecnología conecta culturas!`,
        `¡Qué tal ve! Con ${textPrompt || 'esta nueva tecnología'} podemos crear cosas que ni nos imaginábamos. Es como si tuviéramos un compañero digital que nos ayuda a hacer realidad nuestras ideas más locas. ¡Está de maravilla esto!`,
        `¡Ay, no! ¿En serio podemos hacer esto con ${textPrompt || 'inteligencia artificial'}? Esto está más bueno que un sancocho un domingo. La tecnología nos está cambiando la vida de una manera súper positiva, ¿no te parece?`
      ]
    };
    
    const selectedPrompts = prompts[textStyle];
    const randomText = selectedPrompts[Math.floor(Math.random() * selectedPrompts.length)];
    setGeneratedText(randomText);
    setScore(prev => prev + 15);
    
    if (!achievements.includes('text-generator')) {
      setAchievements(prev => [...prev, 'text-generator']);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // Module complete
      const finalCreations = creations.length > 0 ? creations : [{
        id: crypto.randomUUID(),
        type: 'generative-exploration',
        title: `Exploración Generativa - ${userProfile.name}`,
        description: `Experimentación con IA generativa y arte algorítmico`,
        data: { artParams, generatedText, exploredSections: currentSection + 1 },
        thumbnail: '🎨',
        tags: ['generative-ai', 'creativity', 'art'],
        isPublic: true,
        createdAt: new Date()
      }];
      
      const finalAchievements = [...achievements];
      if (creations.length >= 2) finalAchievements.push('prolific-creator');
      if (currentArt) finalAchievements.push('generative-artist');
      
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
              Arte Generativo con IA
            </h1>
            <p className="text-lg text-gray-600 font-lora">
              Crea arte, música y contenido con algoritmos inteligentes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{score}</div>
            <div className="text-sm text-gray-600">Puntos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{creations.length}</div>
            <div className="text-sm text-gray-600">Creaciones</div>
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
                🎨 La Revolución de la IA Generativa
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="font-lora leading-relaxed">
                    La <strong>IA Generativa</strong> es una rama fascinante que permite a las máquinas 
                    crear contenido original: arte, música, texto, imágenes y más, combinando patrones 
                    aprendidos de millones de ejemplos.
                  </p>
                  
                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-nucleo-purple mb-2">🧠 ¿Cómo funciona?</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li><strong>Entrenamiento:</strong> La IA estudia millones de ejemplos</li>
                      <li><strong>Patrones:</strong> Identifica características y estilos</li>
                      <li><strong>Generación:</strong> Combina patrones de formas nuevas</li>
                      <li><strong>Refinamiento:</strong> Mejora la calidad iterativamente</li>
                      <li><strong>Creatividad:</strong> Produce contenido original</li>
                    </ol>
                  </div>

                  <div className="bg-nucleo-green/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-nucleo-purple mb-2">🌍 A Nivel Global</h4>
                    <p className="text-sm">
                      Artistas de todo el mundo usan IA generativa para crear obras que mezclan 
                      tradiciones culturales locales con estéticas futuristas. En ciudades como Londres, Tokio y São Paulo, colectivos 
                      como "Arte Digital Comuna 13" usan estas herramientas para contar nuevas historias.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">🌟 Aplicaciones de la IA Generativa:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <div className="font-medium text-sm">Arte digital</div>
                        <div className="text-xs text-gray-600">DALL-E, Midjourney, Stable Diffusion</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">📝</span>
                      <div>
                        <div className="font-medium text-sm">Escritura creativa</div>
                        <div className="text-xs text-gray-600">ChatGPT, Claude, Bard</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🎵</span>
                      <div>
                        <div className="font-medium text-sm">Composición musical</div>
                        <div className="text-xs text-gray-600">AIVA, Amper, Soundraw</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🎬</span>
                      <div>
                        <div className="font-medium text-sm">Videos y animación</div>
                        <div className="text-xs text-gray-600">RunwayML, Pika Labs</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">💻</span>
                      <div>
                        <div className="font-medium text-sm">Programación</div>
                        <div className="text-xs text-gray-600">GitHub Copilot, CodeT5</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🏗️</span>
                      <div>
                        <div className="font-medium text-sm">Diseño 3D</div>
                        <div className="text-xs text-gray-600">DreamFusion, Magic3D</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentSection === 1 && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                  🎨 Laboratorio de Arte Generativo
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Algoritmo:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['fractal', 'neural', 'geometric'].map((alg) => (
                          <button
                            key={alg}
                            onClick={() => setArtParams(prev => ({ ...prev, algorithm: alg }))}
                            className={`p-2 text-xs rounded border-2 transition-all ${
                              artParams.algorithm === alg
                                ? 'border-nucleo-purple bg-nucleo-purple/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {alg === 'fractal' ? '🌀 Fractal' : 
                             alg === 'neural' ? '🧠 Neural' : '🔺 Geométrico'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Paleta de colores:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(colorPalettes).map((palette) => (
                          <button
                            key={palette}
                            onClick={() => setArtParams(prev => ({ ...prev, colors: palette }))}
                            className={`p-2 text-xs rounded border-2 transition-all ${
                              artParams.colors === palette
                                ? 'border-nucleo-purple bg-nucleo-purple/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex space-x-1 mb-1">
                              {colorPalettes[palette as keyof typeof colorPalettes].slice(0, 3).map((color, i) => (
                                <div key={i} className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                              ))}
                            </div>
                            {palette}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Complejidad: {artParams.complexity}%
                      </label>
                      <Slider
                        value={[artParams.complexity]}
                        onValueChange={([value]) => setArtParams(prev => ({ ...prev, complexity: value }))}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Aleatoriedad: {artParams.randomness}%
                      </label>
                      <Slider
                        value={[artParams.randomness]}
                        onValueChange={([value]) => setArtParams(prev => ({ ...prev, randomness: value }))}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <Button
                      onClick={generateArt}
                      disabled={isGenerating}
                      className="w-full bg-nucleo-yellow hover:bg-yellow-400 text-nucleo-black"
                    >
                      {isGenerating ? '🎨 Generando arte...' : '✨ Crear Arte Único'}
                    </Button>

                    <div className="bg-nucleo-purple/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-nucleo-purple mb-2">💡 Concepto artístico:</h5>
                      <p className="text-sm">
                        Cada obra que creates es única e irrepetible. Los algoritmos combinan 
                        matemáticas, aleatoriedad y los colores de nuestro bello mundo global 
                        para generar arte que nunca antes ha existido.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="p-3 bg-gray-50 border-b">
                        <h4 className="font-semibold">🖼️ Tu obra maestra:</h4>
                      </div>
                      <div className="p-4 flex justify-center">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={300}
                          className="border rounded shadow-sm"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                      {currentArt && (
                        <div className="p-3 bg-gray-50 border-t">
                          <div className="text-xs text-gray-600">
                            Algoritmo: {artParams.algorithm} | Paleta: {artParams.colors}
                          </div>
                        </div>
                      )}
                    </div>

                    {!currentArt && (
                      <div className="mt-4 text-center text-gray-500 text-sm">
                        Ajusta los parámetros y haz clic en "Crear Arte Único" para ver tu creación
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentSection === 2 && (
            <Card className="p-6">
              <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                🌈 Estudio de Creación Multimodal
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">📝 Generador de Texto Inteligente:</h4>
                    <div className="space-y-3">
                      <Input
                        placeholder="Escribe un tema (ej: café, montañas, tecnología...)"
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                      />
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Estilo de escritura:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['poetic', 'technical', 'casual'] as const).map((style) => (
                            <button
                              key={style}
                              onClick={() => setTextStyle(style)}
                              className={`p-2 text-xs rounded border-2 transition-all ${
                                textStyle === style
                                  ? 'border-nucleo-purple bg-nucleo-purple/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {style === 'poetic' ? '🌸 Poético' :
                               style === 'technical' ? '🔬 Técnico' : '😊 Casual'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={generateText}
                        className="w-full bg-nucleo-purple hover:bg-nucleo-violet text-white"
                      >
                        ✍️ Generar Texto
                      </Button>
                    </div>
                  </div>

                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <h5 className="font-semibold text-nucleo-purple mb-2">🎵 Próximamente - Generador Musical:</h5>
                    <p className="text-sm">
                      Podrás crear música combinando ritmos mundiales con sonidos futuristas. 
                      ¡Imagínate cumbia electrónica generada por IA!
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <Badge variant="secondary">Cumbia-Tech</Badge>
                      <Badge variant="secondary">Vallenato Digital</Badge>
                      <Badge variant="secondary">Reggaeton AI</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedText && (
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className="font-semibold text-nucleo-purple mb-3">📖 Texto generado:</h5>
                      <div className="text-sm leading-relaxed font-lora italic">
                        "{generatedText}"
                      </div>
                      <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                        Estilo: {textStyle} | Prompt: "{textPrompt || 'tema automático'}"
                      </div>
                    </div>
                  )}

                  {!generatedText && (
                    <div className="text-center text-gray-500 py-12">
                      <div className="text-4xl mb-2">✍️</div>
                      <div>Genera texto para ver la magia de la IA creativa</div>
                    </div>
                  )}

                  <div className="bg-nucleo-green/10 p-4 rounded-lg">
                    <h5 className="font-semibold text-nucleo-purple mb-2">🌟 Aplicaciones creativas:</h5>
                    <div className="text-sm space-y-1">
                      <div><strong>Literatura:</strong> Poesía, cuentos, guiones</div>
                      <div><strong>Marketing:</strong> Slogans, descripciones, copy</div>
                      <div><strong>Educación:</strong> Explicaciones, resúmenes, ejemplos</div>
                      <div><strong>Periodismo:</strong> Artículos, reportes, análisis</div>
                      <div><strong>Entretenimiento:</strong> Diálogos, letras, historias</div>
                    </div>
                  </div>

                  <div className="bg-nucleo-purple/10 p-4 rounded-lg">
                    <h5 className="font-semibold text-nucleo-purple mb-2">🌍 Creatividad global con IA:</h5>
                    <p className="text-sm">
                      En ciudades como París, Berlín y Nueva York, escritores y artistas están experimentando con IA para crear 
                      contenido que preserve nuestra riqueza cultural mientras explora nuevas 
                      formas de expresión. ¡La tecnología al servicio de nuestra creatividad!
                    </p>
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
                {achievement === 'digital-artist' && '🎨 Artista Digital'}
                {achievement === 'text-generator' && '✍️ Generador de Texto'}
                {achievement === 'prolific-creator' && '🌟 Creador Prolífico'}
                {achievement === 'generative-artist' && '🎭 Maestro Generativo'}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Creation Gallery */}
      {creations.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-nucleo-purple mb-3">🎨 Tu galería de creaciones:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {creations.map((creation, index) => (
              <div key={index} className="border rounded-lg p-3 bg-white">
                <div className="text-center">
                  <div className="text-2xl mb-1">{creation.thumbnail}</div>
                  <div className="text-xs font-medium truncate">{creation.title}</div>
                  <div className="text-xs text-gray-600 truncate">{creation.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
