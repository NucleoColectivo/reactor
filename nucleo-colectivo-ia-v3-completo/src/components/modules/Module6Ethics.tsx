import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ConcentricCircles } from '../nucleo-identity/ConcentricCircles';
import { ConnectiveLines } from '../nucleo-identity/ConnectiveLines';

interface Module6Props {
  onComplete: (score: number, achievements: string[], creations: any[], decisions: any[]) => void;
  moduleData: any;
  userProfile: any;
}

export const Module6Ethics: React.FC<Module6Props> = ({ 
  onComplete, 
  moduleData, 
  userProfile 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentCase, setCurrentCase] = useState('singapore');
  const [decisions, setDecisions] = useState<any[]>([]);
  const [ethicsMetrics, setEthicsMetrics] = useState({
    privacy: 70,
    efficiency: 60,
    fairness: 75,
    transparency: 65
  });

  const sections = [
    {
      id: 'principles',
      title: 'Principios Éticos Globales',
      description: 'Fundamentos de la ética en IA a nivel mundial',
      icon: '🌍',
      estimatedTime: 4
    },
    {
      id: 'cases',
      title: 'Casos Reales Internacionales',
      description: 'Dilemas éticos de ciudades inteligentes globales',
      icon: '🏙️',
      estimatedTime: 6
    },
    {
      id: 'simulator',
      title: 'Simulador de Decisiones',
      description: 'Toma decisiones éticas y ve las consecuencias',
      icon: '⚖️',
      estimatedTime: 5
    }
  ];

  const globalEthicsCases = [
    {
      id: 'singapore',
      title: 'Singapur Smart Nation: Vigilancia vs Seguridad',
      country: '🇸🇬 Singapur',
      description: 'El gobierno implementa un sistema nacional de cámaras con IA para detectar crímenes en tiempo real.',
      stakeholders: ['Gobierno', 'Ciudadanos', 'Turistas', 'Empresas Tecnológicas', 'ONGs Internacionales'],
      context: 'Singapur quiere ser la primera "Smart Nation" del mundo, pero las cámaras con IA generan debate sobre privacidad.',
      options: [
        {
          id: 'full_surveillance',
          text: 'Vigilancia completa con IA predictiva',
          impact: { privacy: -30, efficiency: +25, fairness: -10, transparency: -15 },
          consequences: ['Crimen reducido 60%', 'Quejas internacionales sobre privacidad', 'Turismo afectado']
        },
        {
          id: 'regulated_system',
          text: 'Sistema regulado con auditorías independientes',
          impact: { privacy: +10, efficiency: +10, fairness: +15, transparency: +20 },
          consequences: ['Balance entre seguridad y privacidad', 'Modelo para otras ciudades', 'Costos adicionales']
        },
        {
          id: 'opt_in_only',
          text: 'Solo con consentimiento ciudadano explícito',
          impact: { privacy: +25, efficiency: -15, fairness: +20, transparency: +25 },
          consequences: ['Participación limitada 40%', 'Máxima transparencia', 'Eficacia reducida']
        }
      ],
      realOutcome: 'Singapur implementó un marco de "IA confiable" con auditorías independientes.',
      globalImpact: 'Influenció políticas de IA en más de 20 países del sudeste asiático.'
    },
    {
      id: 'eu_ai_act',
      title: 'Acta de IA Europea: Regulación Global',
      country: '🇪🇺 Unión Europea',
      description: 'La UE crea la primera ley comprehensiva de IA del mundo, afectando empresas globales.',
      stakeholders: ['Unión Europea', 'Tech Giants', 'Países en Desarrollo', 'Investigadores', 'Ciudadanos'],
      context: 'El AI Act establece reglas estrictas para IA de alto riesgo, pero genera debate sobre innovación vs protección.',
      options: [
        {
          id: 'strict_regulation',
          text: 'Regulación estricta con multas altas',
          impact: { privacy: +30, efficiency: -10, fairness: +25, transparency: +30 },
          consequences: ['Máxima protección ciudadana', 'Innovación restringida', 'Precedente mundial']
        },
        {
          id: 'innovation_balance',
          text: 'Balance entre innovación y protección',
          impact: { privacy: +15, efficiency: +15, fairness: +15, transparency: +15 },
          consequences: ['Desarrollo sostenible', 'Competitividad mantenida', 'Modelo equilibrado']
        },
        {
          id: 'light_touch',
          text: 'Regulación mínima, autorregulación',
          impact: { privacy: -15, efficiency: +25, fairness: -10, transparency: -5 },
          consequences: ['Máxima innovación', 'Riesgos sin control', 'Críticas internacionales']
        }
      ],
      realOutcome: 'El AI Act estableció un marco equilibrado adoptado por 40+ países.',
      globalImpact: 'Primer estándar global de IA, influenciando legislaciones en todo el mundo.'
    }
  ];

  const ethicalPrinciples = [
    {
      id: 'fairness',
      name: 'Equidad y No Discriminación',
      description: 'La IA debe tratar a todas las personas de manera justa, sin sesgos por raza, género, edad u otros factores.',
      globalExamples: [
        'MIT: Algoritmos de contratación sin sesgo de género',
        'Toronto: IA para distribución equitativa de servicios públicos',
        'Amsterdam: Sistemas de crédito sin discriminación racial'
      ],
      metrics: { importance: 95, implementation: 70, global_adoption: 85 }
    },
    {
      id: 'transparency',
      name: 'Transparencia y Explicabilidad',
      description: 'Los sistemas de IA deben ser comprensibles y sus decisiones explicables para los usuarios.',
      globalExamples: [
        'GDPR Europa: Derecho a explicación de decisiones automatizadas',
        'California CCPA: Transparencia en algoritmos de recomendación',
        'Brasil LGPD: Explicación de decisiones de IA en servicios financieros'
      ],
      metrics: { importance: 90, implementation: 60, global_adoption: 70 }
    }
  ];

  const handleDecision = (caseId: string, optionId: string) => {
    const case_ = globalEthicsCases.find(c => c.id === caseId);
    const option = case_?.options.find(o => o.id === optionId);
    
    if (!option) return;

    // Update ethics metrics
    const newMetrics = { ...ethicsMetrics };
    Object.entries(option.impact).forEach(([key, value]) => {
      newMetrics[key as keyof typeof newMetrics] = Math.max(0, Math.min(100, newMetrics[key as keyof typeof newMetrics] + (value as number)));
    });
    setEthicsMetrics(newMetrics);

    // Record decision
    const decision = {
      case: caseId,
      option: optionId,
      impact: option.impact,
      consequences: option.consequences,
      timestamp: Date.now()
    };
    setDecisions(prev => [...prev, decision]);

    // Award points and achievements
    setScore(prev => prev + 25);
    if (!achievements.includes('ethical-decision-maker')) {
      setAchievements(prev => [...prev, 'ethical-decision-maker']);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🌍 Principios Éticos Globales de la IA</h3>
              <p className="text-gray-700 mb-6">
                A nivel mundial, organizaciones como IEEE, Partnership on AI, y la OECD han establecido 
                principios fundamentales que guían el desarrollo ético de la inteligencia artificial.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {ethicalPrinciples.map((principle) => (
                  <Card key={principle.id} className="p-4 border-l-4 border-nucleo-purple">
                    <h4 className="font-semibold text-nucleo-purple mb-2">{principle.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{principle.description}</p>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-semibold">📊 Métricas Globales:</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-gray-600">Importancia</div>
                          <div className="font-bold text-green-600">{principle.metrics.importance}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Implementación</div>
                          <div className="font-bold text-yellow-600">{principle.metrics.implementation}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Adopción Global</div>
                          <div className="font-bold text-blue-600">{principle.metrics.global_adoption}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs font-semibold mb-2">🌍 Ejemplos Globales:</div>
                      <ul className="text-xs space-y-1">
                        {principle.globalExamples.map((example, index) => (
                          <li key={index} className="text-gray-600">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">🏙️ Casos Reales Internacionales</h3>
              
              <Tabs value={currentCase} onValueChange={setCurrentCase}>
                <TabsList className="grid w-full grid-cols-2">
                  {globalEthicsCases.map((case_) => (
                    <TabsTrigger key={case_.id} value={case_.id} className="text-xs">
                      {case_.country}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {globalEthicsCases.map((case_) => (
                  <TabsContent key={case_.id} value={case_.id} className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-nucleo-purple mb-3">{case_.title}</h4>
                        <p className="text-gray-700 mb-4">{case_.description}</p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="font-semibold text-sm mb-2">📋 Contexto:</div>
                          <p className="text-sm text-gray-700">{case_.context}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-sm mb-3">⚖️ ¿Qué decisión tomarías?</div>
                        <div className="space-y-3">
                          {case_.options.map((option) => (
                            <Card key={option.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium mb-2">{option.text}</div>
                                  <div className="text-sm text-gray-600 mb-3">
                                    Consecuencias esperadas:
                                  </div>
                                  <ul className="text-xs space-y-1">
                                    {option.consequences.map((consequence, index) => (
                                      <li key={index} className="text-gray-600">• {consequence}</li>
                                    ))}
                                  </ul>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleDecision(case_.id, option.id)}
                                  className="ml-4 bg-nucleo-purple hover:bg-nucleo-violet text-white"
                                >
                                  Elegir
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-semibold text-green-700 mb-2">✅ Resultado Real:</div>
                        <p className="text-sm text-gray-700 mb-2">{case_.realOutcome}</p>
                        <div className="font-semibold text-green-700 mb-1">🌍 Impacto Global:</div>
                        <p className="text-sm text-gray-700">{case_.globalImpact}</p>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nucleo-purple mb-4">⚖️ Dashboard de Decisiones Éticas</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">📊 Métricas Éticas Actuales</h4>
                  <div className="space-y-4">
                    {Object.entries(ethicsMetrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key}:</span>
                          <span className={value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                            {value}%
                          </span>
                        </div>
                        <Progress value={value} className="h-3" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">🎯 Puntuación Ética Total:</h5>
                    <div className="text-2xl font-bold text-nucleo-purple">
                      {Math.round(Object.values(ethicsMetrics).reduce((a, b) => a + b, 0) / 4)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Basado en promedio de todas las dimensiones éticas
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">📋 Historial de Decisiones</h4>
                  {decisions.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {decisions.map((decision, index) => {
                        const case_ = globalEthicsCases.find(c => c.id === decision.case);
                        return (
                          <Card key={index} className="p-3">
                            <div className="text-sm font-medium">{case_?.title}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Opción elegida: {case_?.options.find(o => o.id === decision.option)?.text}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-2">⚖️</div>
                      <div>No has tomado decisiones éticas aún.</div>
                      <div className="text-sm">Regresa a la sección anterior para explorar casos.</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSectionComplete = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setScore(prev => prev + 30);
    } else {
      // Module complete
      const finalScore = score + 50;
      const finalAchievements = [...achievements, 'global-ethics-expert'];
      onComplete(finalScore, finalAchievements, [], decisions);
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
              Ética IA Global - Casos Internacionales
            </h1>
            <p className="text-lg text-gray-600 font-lora">
              Simulador de decisiones urbanas y debates colaborativos mundiales
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
            Puntuación ética: <span className="font-bold text-nucleo-purple">{score} puntos</span>
            {decisions.length > 0 && (
              <span className="ml-4">
                Decisiones tomadas: <span className="font-bold text-nucleo-yellow">{decisions.length}</span>
              </span>
            )}
          </div>
          <Button
            onClick={handleSectionComplete}
            className="bg-nucleo-yellow hover:bg-nucleo-yellow/80 text-nucleo-black"
          >
            {currentSection < sections.length - 1 ? 'Siguiente Sección' : 'Completar Módulo'} →
          </Button>
        </div>
        
        {achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-semibold text-nucleo-purple mb-2">🏆 Logros Éticos Desbloqueados:</div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {achievement === 'ethical-decision-maker' ? '⚖️ Tomador de Decisiones Éticas' : 
                   achievement === 'global-ethics-expert' ? '🌍 Experto en Ética Global' : achievement}
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
