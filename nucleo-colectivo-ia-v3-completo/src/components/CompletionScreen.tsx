import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ConcentricCircles } from './nucleo-identity/ConcentricCircles';
import { ConnectiveLines } from './nucleo-identity/ConnectiveLines';
import { OfficialNucleoLogo } from './nucleo-identity/OfficialNucleoLogo';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface CompletionScreenProps {
  onRestart: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ onRestart }) => {
  const {
    userProfile,
    moduleProgress,
    achievements,
    getTotalPlayTime,
    getUserLevel,
    getEthicalDecisionStats,
    getSocialImpactScore,
    resetGame
  } = useGameStore();

  const [showCertificate, setShowCertificate] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const totalScore = moduleProgress.reduce((sum, module) => sum + module.score, 0);
  const totalTime = Math.floor(getTotalPlayTime() / 1000 / 60); // minutes
  const ethicsStats = getEthicalDecisionStats();
  const socialImpact = getSocialImpactScore();

  const getPerformanceLevel = () => {
    if (totalScore >= 1000) return { level: 'Excelente', color: 'text-nucleo-purple', emoji: '🌟' };
    if (totalScore >= 800) return { level: 'Muy Bueno', color: 'text-nucleo-violet', emoji: '⭐' };
    if (totalScore >= 600) return { level: 'Bueno', color: 'text-nucleo-yellow', emoji: '✨' };
    return { level: 'Completado', color: 'text-gray-600', emoji: '✅' };
  };

  const performance = getPerformanceLevel();

  const handleRestart = () => {
    resetGame();
    onRestart();
  };

  const handleDownloadCertificate = () => {
    // Implementation for certificate download would go here
    setShowCertificate(true);
  };

  const handleShareResults = () => {
    const shareText = `¡Completé Educación IA Global de Nucleo Colectivo! 🎉\n\nPuntuación: ${totalScore}\nNivel: ${getUserLevel()}\nLogros: ${achievements.length}\n\n#NucleoColectivo #EducacionIA #IAGlobal`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Educación IA Global - Nucleo Colectivo',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('¡Resultados copiados al portapapeles!');
    }
  };

  useEffect(() => {
    // Show stats after animation
    setTimeout(() => setShowStats(true), 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nucleo-yellow via-nucleo-white to-nucleo-purple/20 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <ConnectiveLines
          width={window.innerWidth}
          height={window.innerHeight}
          nodeCount={25}
          color="purple"
          animated={true}
          showDataFlow={true}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Main Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 mb-12"
        >
          <div className="space-y-6">
            <OfficialNucleoLogo size="lg" className="mx-auto" />
            
            <div>
              <motion.h1 
                className="text-4xl md:text-6xl font-bold font-montserrat mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-nucleo-purple via-nucleo-violet to-nucleo-yellow bg-clip-text text-transparent">
                  ¡Felicitaciones!
                </span>
              </motion.h1>
              
              <motion.h2 
                className="text-2xl md:text-3xl text-nucleo-purple font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Has completado tu transformación en {getUserLevel()}
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto font-lora"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Tu viaje por el mundo de la Inteligencia Artificial ha culminado con éxito. 
                Ahora eres parte de la nueva generación que usará la IA para transformar el mundo.
              </motion.p>
            </div>
          </div>

          {/* Performance Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="inline-block"
          >
            <Badge 
              variant="secondary" 
              className={`text-2xl px-6 py-3 ${performance.color} bg-white border-2 border-current`}
            >
              {performance.emoji} {performance.level}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 40 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="p-6 text-center">
            <div className="text-3xl text-nucleo-purple font-bold mb-2">
              {totalScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Puntuación Total</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl text-nucleo-purple font-bold mb-2">
              {achievements.length}
            </div>
            <div className="text-sm text-gray-600">Logros Desbloqueados</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl text-nucleo-purple font-bold mb-2">
              {totalTime}
            </div>
            <div className="text-sm text-gray-600">Minutos Jugados</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl text-nucleo-purple font-bold mb-2">
              {userProfile.neurotokens.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Neurotokens Ganados</div>
          </Card>
        </motion.div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Module Progress */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-nucleo-purple mb-4">
              📊 Progreso por Módulos
            </h3>
            <div className="space-y-4">
              {moduleProgress.map((module, index) => (
                <div key={module.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{module.name}</span>
                    <span className="text-sm text-nucleo-purple">
                      {module.score}/{module.maxScore}
                    </span>
                  </div>
                  <Progress 
                    value={(module.score / module.maxScore) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-nucleo-purple mb-4">
              🏆 Logros Conseguidos
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {achievements.map((achievement, index) => (
                <div 
                  key={achievement.id}
                  className="flex items-center space-x-3 p-3 bg-nucleo-yellow/10 rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-semibold">{achievement.name}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Social Impact Section */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-nucleo-green/10 to-nucleo-yellow/10">
          <h3 className="text-2xl font-bold text-nucleo-purple mb-4 text-center">
            🌍 Tu Impacto Social
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl text-nucleo-purple font-bold mb-2">
                {socialImpact}
              </div>
              <div className="text-sm text-gray-600">Puntos de Impacto Social</div>
            </div>
            <div>
              <div className="text-3xl text-nucleo-purple font-bold mb-2">
                {ethicsStats.positive}
              </div>
              <div className="text-sm text-gray-600">Decisiones Éticas Positivas</div>
            </div>
            <div>
              <div className="text-3xl text-nucleo-purple font-bold mb-2">
                {Math.round(ethicsStats.averageSocialScore || 0)}%
              </div>
              <div className="text-sm text-gray-600">Promedio de Responsabilidad</div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4 font-lora">
            Has demostrado un compromiso excepcional con el uso ético y responsable de la IA.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleDownloadCertificate}
            className="bg-nucleo-purple hover:bg-nucleo-violet text-white px-8 py-3"
          >
            📜 Descargar Certificado
          </Button>
          
          <Button
            onClick={handleShareResults}
            variant="outline"
            className="border-nucleo-purple text-nucleo-purple hover:bg-nucleo-purple hover:text-white px-8 py-3"
          >
            📱 Compartir Resultados
          </Button>
          
          <Button
            onClick={handleRestart}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3"
          >
            🔄 Jugar de Nuevo
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-nucleo-purple mb-4">
            🚀 ¿Qué sigue ahora?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-4xl">🎓</div>
              <h4 className="font-semibold">Continúa Aprendiendo</h4>
              <p className="text-sm text-gray-600">
                Explora cursos avanzados de IA en Núcleo Colectivo
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🤝</div>
              <h4 className="font-semibold">Únete a la Comunidad</h4>
              <p className="text-sm text-gray-600">
                Conecta con otros miembros en nuestros eventos
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🏗️</div>
              <h4 className="font-semibold">Crea con IA</h4>
              <p className="text-sm text-gray-600">
                Aplica lo aprendido en proyectos reales de impacto social
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="font-lora italic mb-2">
            "La inteligencia artificial al servicio de la transformación social"
          </p>
          <p className="text-sm font-roboto-mono">
            Núcleo Colectivo Global • Educación IA Global • 2024
          </p>
        </div>
      </div>

      {/* Floating Celebration Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            {['🎉', '⭐', '🎯', '🚀', '💎', '🌟'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
