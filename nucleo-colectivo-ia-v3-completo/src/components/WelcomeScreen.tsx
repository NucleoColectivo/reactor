import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConcentricCircles } from './nucleo-identity/ConcentricCircles';
import { ConnectiveLines } from './nucleo-identity/ConnectiveLines';
import { OfficialNucleoLogo } from './nucleo-identity/OfficialNucleoLogo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Avatar } from '../store/gameStore';

interface WelcomeScreenProps {
  onStartGame: (userName: string, avatar: Avatar, preferences: any) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'profile' | 'avatar' | 'preferences'>('welcome');
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({
    skin: 'medium',
    hair: 'curly-black',
    eyes: 'brown',
    clothing: 'casual-modern',
    accessories: [],
    culturalElements: ['colombia-flag-pin'],
    accessibilityFeatures: [],
    expressions: {
      default: 'friendly',
      happy: 'bright-smile',
      focused: 'concentrated',
      surprised: 'wide-eyes',
      thoughtful: 'chin-rest'
    }
  });
  const [preferences, setPreferences] = useState({
    audioEnabled: true,
    audioVolume: 0.7,
    narrationEnabled: true,
    narrationLanguage: 'es-CO' as const,
    voiceSpeed: 1.0,
    accessibilityMode: false,
    highContrastMode: false,
    reducedMotion: false,
    subtitlesEnabled: false,
    collaborationMode: 'open' as 'open' | 'friends' | 'private'
  });

  const skinOptions = [
    { id: 'light', name: 'Clara', color: '#FDBCB4' },
    { id: 'medium', name: 'Morena', color: '#E08B69' },
    { id: 'dark', name: 'Oscura', color: '#8D5524' },
    { id: 'indigenous', name: 'Indígena', color: '#A0522D' }
  ];

  const hairOptions = [
    { id: 'straight-black', name: 'Liso Negro', emoji: '🦱' },
    { id: 'curly-black', name: 'Rizado Negro', emoji: '🦲' },
    { id: 'wavy-brown', name: 'Ondulado Castaño', emoji: '🦳' },
    { id: 'afro', name: 'Afro', emoji: '🦴' },
    { id: 'braids', name: 'Trenzas', emoji: '💇‍♀️' }
  ];

  const clothingOptions = [
    { id: 'casual-modern', name: 'Casual Moderno', emoji: '👕' },
    { id: 'business', name: 'Ejecutivo', emoji: '👔' },
    { id: 'artista', name: 'Artista', emoji: '🎨' },
    { id: 'student', name: 'Estudiante', emoji: '🎓' },
    { id: 'traditional', name: 'Tradicional', emoji: '👘' }
  ];

  const culturalElements = [
    { id: 'colombia-flag-pin', name: 'Pin Colombia', emoji: '🇨🇴' },
    { id: 'global-badge', name: 'Símbolo Global', emoji: '🌍' },
    { id: 'innovation-hat', name: 'Sombrero Innovador', emoji: '👒' },
    { id: 'coffee-pin', name: 'Pin Café', emoji: '☕' },
    { id: 'orchid-flower', name: 'Orquídea', emoji: '🌺' }
  ];

  const handleNext = () => {
    const steps = ['welcome', 'profile', 'avatar', 'preferences'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1] as any);
    }
  };

  const handleBack = () => {
    const steps = ['welcome', 'profile', 'avatar', 'preferences'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1] as any);
    }
  };

  const handleStartGame = () => {
    if (userName.trim()) {
      onStartGame(userName, selectedAvatar, preferences);
    }
  };

  const updateAvatar = (field: keyof Avatar, value: any) => {
    setSelectedAvatar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleCulturalElement = (elementId: string) => {
    setSelectedAvatar(prev => ({
      ...prev,
      culturalElements: prev.culturalElements.includes(elementId)
        ? prev.culturalElements.filter(id => id !== elementId)
        : [...prev.culturalElements, elementId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nucleo-yellow via-nucleo-white to-nucleo-purple/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <ConnectiveLines
          width={window.innerWidth}
          height={window.innerHeight}
          nodeCount={15}
          color="purple"
          animated={true}
          showDataFlow={false}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              {/* Main Logo and Title */}
              <div className="space-y-8">
                <OfficialNucleoLogo size="xl" className="mx-auto" />
                
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">
                    <span className="bg-gradient-to-r from-nucleo-purple via-nucleo-violet to-nucleo-yellow bg-clip-text text-transparent">
                      Educación IA Global
                    </span>
                  </h1>
                  <h2 className="text-xl md:text-2xl text-nucleo-purple font-medium mb-2">
                    Experiencia Interactiva de Inteligencia Artificial
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto font-lora leading-relaxed">
                    Embárcate en una experiencia educativa interactiva única que combina 
                    inteligencia artificial, colaboración en tiempo real y transformación social.
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 my-12">
                {[
                  {
                    icon: '🧠',
                    title: '6 Módulos Inmersivos',
                    description: 'Desde fundamentos hasta ética aplicada'
                  },
                  {
                    icon: '🤝',
                    title: 'Colaboración Real',
                    description: 'WebRTC para trabajar juntos en tiempo real'
                  },
                  {
                    icon: '🎨',
                    title: 'Creación con IA',
                    description: 'TensorFlow.js y ml5 integrados'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  >
                    <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-3">{feature.icon}</div>
                      <h3 className="font-semibold text-nucleo-purple mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-nucleo-purple hover:bg-nucleo-violet text-white px-8 py-4 text-lg font-semibold"
                >
                  🚀 Comenzar la Aventura
                </Button>
                <p className="text-sm text-gray-500">
                  Tiempo estimado: 60-90 minutos • Guarda tu progreso automáticamente
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-nucleo-purple mb-4">
                    ¡Hola, futuro colaborador! 👋
                  </h2>
                  <p className="text-gray-600 font-lora">
                    Cuéntanos un poco sobre ti para personalizar tu experiencia.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ¿Cómo te gustaría que te llamemos?
                    </label>
                    <Input
                      type="text"
                      placeholder="Tu nombre o nickname"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-lg p-4"
                      maxLength={20}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Este nombre aparecerá en colaboraciones y certificados
                    </p>
                  </div>

                  <div className="bg-nucleo-yellow/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-nucleo-purple mb-2">
                      🌟 ¿Sabías que...?
                    </h3>
                    <p className="text-sm text-gray-700">
                      A nivel global hay más de 12,000 empresas trabajando con IA, desde startups 
                      hasta corporaciones. ¡Tú podrías ser parte del futuro tecnológico de la ciudad!
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handleBack}>
                    ← Volver
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!userName.trim()}
                    className="bg-nucleo-purple hover:bg-nucleo-violet text-white"
                  >
                    Continuar →
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'avatar' && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-nucleo-purple mb-4">
                    Crea tu Avatar Digital 🎨
                  </h2>
                  <p className="text-gray-600 font-lora">
                    Personaliza tu representación en la experiencia educativa de Nucleo Colectivo
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Avatar Preview */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-nucleo-yellow/20 to-nucleo-purple/20 rounded-2xl p-8 mb-4">
                      <div className="text-8xl mb-4">👤</div>
                      <div className="text-lg font-semibold text-nucleo-purple">
                        {userName || 'Tu Avatar'}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {selectedAvatar.culturalElements.map(element => 
                          culturalElements.find(ce => ce.id === element)?.emoji
                        ).join(' ')}
                      </div>
                    </div>
                  </div>

                  {/* Customization Options */}
                  <div className="space-y-6">
                    <Tabs defaultValue="appearance" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                        <TabsTrigger value="culture">Cultura</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="appearance" className="space-y-4">
                        {/* Skin */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Tono de piel</label>
                          <div className="grid grid-cols-2 gap-2">
                            {skinOptions.map(option => (
                              <button
                                key={option.id}
                                onClick={() => updateAvatar('skin', option.id)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  selectedAvatar.skin === option.id
                                    ? 'border-nucleo-purple bg-nucleo-purple/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div 
                                  className="w-6 h-6 rounded-full mx-auto mb-1"
                                  style={{ backgroundColor: option.color }}
                                />
                                <div className="text-xs">{option.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Hair */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Cabello</label>
                          <div className="grid grid-cols-2 gap-2">
                            {hairOptions.map(option => (
                              <button
                                key={option.id}
                                onClick={() => updateAvatar('hair', option.id)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  selectedAvatar.hair === option.id
                                    ? 'border-nucleo-purple bg-nucleo-purple/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-lg mb-1">{option.emoji}</div>
                                <div className="text-xs">{option.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Clothing */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Vestimenta</label>
                          <div className="grid grid-cols-2 gap-2">
                            {clothingOptions.map(option => (
                              <button
                                key={option.id}
                                onClick={() => updateAvatar('clothing', option.id)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  selectedAvatar.clothing === option.id
                                    ? 'border-nucleo-purple bg-nucleo-purple/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-lg mb-1">{option.emoji}</div>
                                <div className="text-xs">{option.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="culture" className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Elementos culturales (selecciona varios)
                          </label>
                          <div className="space-y-2">
                            {culturalElements.map(element => (
                              <button
                                key={element.id}
                                onClick={() => toggleCulturalElement(element.id)}
                                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                                  selectedAvatar.culturalElements.includes(element.id)
                                    ? 'border-nucleo-purple bg-nucleo-purple/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-lg">{element.emoji}</span>
                                <span className="text-sm">{element.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-nucleo-green/10 p-4 rounded-lg">
                          <h4 className="font-semibold text-nucleo-purple mb-2">
                            🌍 Diversidad e Inclusión
                          </h4>
                          <p className="text-sm text-gray-700">
                            Celebramos la diversidad cultural mundial. Tu avatar 
                            representa la riqueza cultural de nuestra comunidad.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handleBack}>
                    ← Volver
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-nucleo-purple hover:bg-nucleo-violet text-white"
                  >
                    Continuar →
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-nucleo-purple mb-4">
                    Preferencias de Experiencia ⚙️
                  </h2>
                  <p className="text-gray-600 font-lora">
                    Configura tu experiencia para que sea perfecta para ti
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Audio Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-nucleo-purple">🔊 Audio</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Efectos de sonido</div>
                        <div className="text-sm text-gray-600">Sonidos de interacción y feedback</div>
                      </div>
                      <Switch
                        checked={preferences.audioEnabled}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, audioEnabled: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Narración de voz</div>
                        <div className="text-sm text-gray-600">Asistente virtual multiidioma global</div>
                      </div>
                      <Switch
                        checked={preferences.narrationEnabled}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, narrationEnabled: checked }))
                        }
                      />
                    </div>
                  </div>

                  {/* Accessibility */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-nucleo-purple">♿ Accesibilidad</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Modo alto contraste</div>
                        <div className="text-sm text-gray-600">Mejora la visibilidad de elementos</div>
                      </div>
                      <Switch
                        checked={preferences.highContrastMode}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, highContrastMode: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Reducir animaciones</div>
                        <div className="text-sm text-gray-600">Para personas sensibles al movimiento</div>
                      </div>
                      <Switch
                        checked={preferences.reducedMotion}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, reducedMotion: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Subtítulos</div>
                        <div className="text-sm text-gray-600">Texto para contenido de audio</div>
                      </div>
                      <Switch
                        checked={preferences.subtitlesEnabled}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, subtitlesEnabled: checked }))
                        }
                      />
                    </div>
                  </div>

                  {/* Collaboration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-nucleo-purple">🤝 Colaboración</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Modo de colaboración
                      </label>
                      <select
                        value={preferences.collaborationMode}
                        onChange={(e) => 
                          setPreferences(prev => ({ 
                            ...prev, 
                            collaborationMode: e.target.value as 'open' | 'friends' | 'private'
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="open">🌍 Abierto - Cualquiera puede unirse</option>
                        <option value="friends">👥 Amigos - Solo invitados</option>
                        <option value="private">🔒 Privado - Solo yo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handleBack}>
                    ← Volver
                  </Button>
                  <Button 
                    onClick={handleStartGame}
                    className="bg-nucleo-yellow hover:bg-yellow-400 text-nucleo-black font-semibold px-8"
                  >
                    🚀 ¡Comenzar Aventura!
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {['welcome', 'profile', 'avatar', 'preferences'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentStep === step
                    ? 'bg-nucleo-purple'
                    : index < ['welcome', 'profile', 'avatar', 'preferences'].indexOf(currentStep)
                    ? 'bg-nucleo-yellow'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
