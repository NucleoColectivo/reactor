import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ConcentricCircles } from '../nucleo-identity/ConcentricCircles';

interface Module2Props {
  onComplete: (score: number, achievements: string[], creations: any[], decisions: any[]) => void;
  moduleData: any;
  userProfile: any;
}

export const Module2Conversational: React.FC<Module2Props> = ({ 
  onComplete, 
  moduleData, 
  userProfile 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [score, setScore] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'bot', message: string, sentiment?: 'positive' | 'negative' | 'neutral'}>>([]);
  const [userInput, setUserInput] = useState('');
  const [sentimentAnalysis, setSentimentAnalysis] = useState<{positive: number, negative: number, neutral: number}>({positive: 0, negative: 0, neutral: 0});
  const [botPersonality, setBotPersonality] = useState<'friendly' | 'professional' | 'creative'>('friendly');
  const [creations, setCreations] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  const sections = [
    { id: 'intro', title: 'Procesamiento de Lenguaje Natural', time: 1 },
    { id: 'chatbot', title: 'Construye tu Chatbot', time: 1 },
    { id: 'sentiment', title: 'Análisis de Sentimientos', time: 1 }
  ];

  // Predefined responses for the chatbot
  const botResponses = {
    friendly: {
      greeting: "¡Hola! Soy tu asistente virtual global. ¿En qué te puedo ayudar hoy? 😊",
      default: "¡Qué interesante! Cuéntame más sobre eso.",
      goodbye: "¡Hasta luego! Que tengas un día increíble.",
      global: "¡La innovación tecnológica global es impresionante! ¿Has escuchado sobre Singapur Smart Nation?",
      technology: "La tecnología mundial está llena de magia e innovación. ¿Sabías que ciudades como Helsinki y Toronto lideran en IA?",
      ia: "La inteligencia artificial es fascinante. ¡En todo el mundo hay proyectos increíbles!"
    },
    professional: {
      greeting: "Buenos días. Soy un asistente especializado en IA. ¿Cómo puedo asistirle?",
      default: "Entiendo su consulta. Permítame procesar esa información.",
      goodbye: "Gracias por usar nuestros servicios. Hasta pronto.",
      global: "Las ciudades inteligentes como Singapur, Helsinki y Barcelona son reconocidas internacionalmente por su transformación digital.",
      technology: "El mundo ha experimentado un crecimiento significativo en el sector tecnológico global.",
      ia: "La inteligencia artificial presenta oportunidades importantes para el desarrollo económico."
    },
    creative: {
      greeting: "¡Hola, ser creativo! 🎨 Soy tu compañero digital lleno de ideas. ¿Qué vamos a crear hoy?",
      default: "¡Wow! Eso despertó mi creatividad. ¿Y si lo combinamos con algo inesperado?",
      goodbye: "¡Que tu creatividad florezca como la innovación global! 🌺",
      global: "¡El mundo es pura inspiración! Desde el arte digital en Tokio hasta la innovación tecnológica en Silicon Valley. ¿Has explorado el arte digital internacional?",
      technology: "El mundo es un lienzo de culturas, colores y tecnología. ¡Somos una comunidad global de creatividad infinita!",
      ia: "La IA es como magia moderna. ¡Imagínate las obras de arte que podemos crear juntos!"
    }
  };

  // Simple sentiment analysis function
  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['bueno', 'excelente', 'genial', 'increíble', 'fantástico', 'me gusta', 'perfecto', 'maravilloso'];
    const negativeWords = ['malo', 'terrible', 'horrible', 'odio', 'no me gusta', 'awful', 'pésimo'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Bot response logic
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const responses = botResponses[botPersonality];
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('hi')) {
      return responses.greeting;
    }
    if (lowerMessage.includes('adiós') || lowerMessage.includes('bye')) {
      return responses.goodbye;
    }
    if (lowerMessage.includes('global') || lowerMessage.includes('mundial') || lowerMessage.includes('internacional')) {
      return responses.global;
    }
    if (lowerMessage.includes('tecnología') || lowerMessage.includes('tech') || lowerMessage.includes('innovación')) {
      return responses.technology;
    }
    if (lowerMessage.includes('ia') || lowerMessage.includes('inteligencia artificial')) {
      return responses.ia;
    }
    
    return responses.default;
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    const sentiment = analyzeSentiment(userInput);
    const newUserMessage = { role: 'user' as const, message: userInput, sentiment };
    
    // Add user message
    setChatMessages(prev => [...prev, newUserMessage]);
    
    // Get bot response
    setTimeout(() => {
      const botResponse = getBotResponse(userInput);
      setChatMessages(prev => [...prev, { role: 'bot' as const, message: botResponse }]);
    }, 1000);
    
    // Update sentiment analysis
    setSentimentAnalysis(prev => ({
      ...prev,
      [sentiment]: prev[sentiment] + 1
    }));
    
    // Award points
    setScore(prev => prev + 10);
    
    setUserInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // Module complete
      const finalCreations = creations.length > 0 ? creations : [{
        id: crypto.randomUUID(),
        type: 'chatbot',
        title: `Chatbot ${botPersonality} - ${userProfile.name}`,
        description: `Chatbot conversacional con personalidad ${botPersonality}`,
        data: { personality: botPersonality, messagesCount: chatMessages.length },
        thumbnail: '💬',
        tags: ['nlp', 'chatbot', botPersonality],
        isPublic: true,
        createdAt: new Date()
      }];
      
      const finalAchievements = [...achievements];
      if (chatMessages.length >= 5) finalAchievements.push('conversational-expert');
      if (sentimentAnalysis.positive > sentimentAnalysis.negative) finalAchievements.push('positive-communicator');
      
      onComplete(score, finalAchievements, finalCreations, []);
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
              IA Conversacional
            </h1>
            <p className="text-lg text-gray-600 font-lora">
              Construye chatbots y analiza el lenguaje natural
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{score}</div>
            <div className="text-sm text-gray-600">Puntos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nucleo-purple">{chatMessages.length}</div>
            <div className="text-sm text-gray-600">Mensajes</div>
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
                ¿Cómo entienden las máquinas nuestro lenguaje? 🗣️
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="font-lora leading-relaxed">
                    El <strong>Procesamiento de Lenguaje Natural (NLP)</strong> es la rama de la IA 
                    que permite a las máquinas entender, interpretar y generar lenguaje humano.
                  </p>
                  
                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-nucleo-purple mb-2">🔍 ¿Cómo funciona?</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li><strong>Tokenización:</strong> Dividir texto en palabras</li>
                      <li><strong>Análisis semántico:</strong> Entender el significado</li>
                      <li><strong>Contexto:</strong> Considerar el entorno de las palabras</li>
                      <li><strong>Respuesta:</strong> Generar una respuesta apropiada</li>
                    </ol>
                  </div>

                  <div className="bg-nucleo-green/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-nucleo-purple mb-2">🌍 NLP Global</h4>
                    <p className="text-sm">
                      En todo el mundo, desde Silicon Valley hasta Tel Aviv, se desarrollan chatbots multiidioma 
                      que entienden expresiones culturales únicas de cada región y país.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">🎯 Ejemplos de NLP:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🗣️</span>
                      <div>
                        <div className="font-medium text-sm">Reconocimiento de voz</div>
                        <div className="text-xs text-gray-600">Convertir habla en texto</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <div className="font-medium text-sm">Traducción automática</div>
                        <div className="text-xs text-gray-600">Google Translate</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">💬</span>
                      <div>
                        <div className="font-medium text-sm">Chatbots inteligentes</div>
                        <div className="text-xs text-gray-600">Asistentes virtuales</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <span className="text-2xl">😊</span>
                      <div>
                        <div className="font-medium text-sm">Análisis de sentimientos</div>
                        <div className="text-xs text-gray-600">Detectar emociones en texto</div>
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
                  🤖 Constructor de Chatbot Global
                </h3>
                
                {/* Personality Selector */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Personalidad del Bot:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['friendly', 'professional', 'creative'] as const).map((personality) => (
                      <button
                        key={personality}
                        onClick={() => setBotPersonality(personality)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          botPersonality === personality
                            ? 'border-nucleo-purple bg-nucleo-purple/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">
                          {personality === 'friendly' ? '😊' : personality === 'professional' ? '💼' : '🎨'}
                        </div>
                        <div className="text-sm font-medium capitalize">{personality}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-nucleo-purple text-white p-4">
                    <h4 className="font-semibold">💬 Chat con tu Bot Global</h4>
                    <p className="text-sm opacity-90">
                      Conversa y ve cómo responde según su personalidad
                    </p>
                  </div>
                  
                  <div className="h-64 overflow-y-auto p-4 bg-gray-50">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-500 text-sm">
                        ¡Inicia la conversación! Escribe algo como "Hola" o pregunta sobre tecnología global.
                      </div>
                    )}
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-nucleo-purple text-white' 
                            : 'bg-white border'
                        }`}>
                          <div className="text-sm">{msg.message}</div>
                          {msg.sentiment && (
                            <div className={`text-xs mt-1 px-2 py-1 rounded ${getSentimentColor(msg.sentiment)}`}>
                              {msg.sentiment}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-2">
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-nucleo-purple hover:bg-nucleo-violet text-white"
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentSection === 2 && (
            <Card className="p-6">
              <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
                😊 Análisis de Sentimientos en Tiempo Real
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📊 Estadísticas de tu conversación:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border">
                      <span className="text-green-700 font-medium">😊 Positivos</span>
                      <span className="text-xl font-bold text-green-700">{sentimentAnalysis.positive}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <span className="text-gray-700 font-medium">😐 Neutrales</span>
                      <span className="text-xl font-bold text-gray-700">{sentimentAnalysis.neutral}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded border">
                      <span className="text-red-700 font-medium">😞 Negativos</span>
                      <span className="text-xl font-bold text-red-700">{sentimentAnalysis.negative}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-nucleo-yellow/10 rounded-lg">
                    <h5 className="font-semibold text-nucleo-purple mb-2">🧠 ¿Cómo funciona?</h5>
                    <p className="text-sm">
                      El análisis de sentimientos usa NLP para detectar emociones en texto. 
                      Identifica palabras clave y patrones para clasificar el tono como 
                      positivo, negativo o neutral.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">🏢 Aplicaciones Reales:</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border">
                      <div className="font-medium text-sm text-nucleo-purple">Redes Sociales</div>
                      <div className="text-xs text-gray-600">
                        Monitorear la percepción de marca en tiempo real
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <div className="font-medium text-sm text-nucleo-purple">Atención al Cliente</div>
                      <div className="text-xs text-gray-600">
                        Detectar clientes insatisfechos automáticamente
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <div className="font-medium text-sm text-nucleo-purple">Investigación de Mercado</div>
                      <div className="text-xs text-gray-600">
                        Analizar opiniones sobre productos o servicios
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <div className="font-medium text-sm text-nucleo-purple">Salud Mental</div>
                      <div className="text-xs text-gray-600">
                        Detectar señales de depresión en texto
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-nucleo-green/10 rounded-lg">
                    <h5 className="font-semibold text-nucleo-purple mb-2">🌍 A Nivel Global</h5>
                    <p className="text-sm">
                      La alcaldía usa análisis de sentimientos para monitorear 
                      la satisfacción ciudadana en redes sociales y mejorar 
                      los servicios públicos.
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
                {achievement === 'conversational-expert' && '💬 Experto Conversacional'}
                {achievement === 'positive-communicator' && '😊 Comunicador Positivo'}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
