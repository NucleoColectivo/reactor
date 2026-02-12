import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConcentricCircles } from './nucleo-identity/ConcentricCircles';
import { ConnectiveLines } from './nucleo-identity/ConnectiveLines';
import { OfficialNucleoLogo } from './nucleo-identity/OfficialNucleoLogo';

export const LoadingScreen: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const loadingSteps = [
    'Inicializando Núcleo Colectivo...',
    'Cargando TensorFlow.js...',
    'Preparando módulos de IA...',
    'Configurando colaboración...',
    'Sincronizando datos globales...',
    'Activando inteligencia artificial...',
    '¡Listo para transformar!'
  ];

  useEffect(() => {
    const simulateLoading = () => {
      const duration = 4000; // 4 seconds total
      const steps = loadingSteps.length;
      const stepDuration = duration / steps;

      loadingSteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentStep(step);
          setLoadingProgress((index + 1) / steps * 100);
        }, index * stepDuration);
      });
    };

    simulateLoading();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nucleo-yellow via-nucleo-white to-nucleo-purple flex items-center justify-center relative overflow-hidden">
      {/* Background Animated Network */}
      <div className="absolute inset-0 opacity-20">
        <ConnectiveLines
          width={window.innerWidth}
          height={window.innerHeight}
          nodeCount={20}
          color="purple"
          animated={true}
          showDataFlow={true}
        />
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Nucleo Colectivo Logo Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center mb-4 space-y-6">
            <OfficialNucleoLogo size="lg" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-nucleo-purple font-montserrat">
                Cargando experiencia educativa...
              </h2>
              <p className="text-lg text-gray-600 mt-2 font-lora">
                Educación IA Global
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-nucleo-purple to-nucleo-yellow"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            
            {/* Progress Indicator */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600 font-roboto-mono">
                {Math.round(loadingProgress)}%
              </span>
              <span className="text-sm text-nucleo-purple font-medium">
                Cargando...
              </span>
            </div>
          </div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-center"
          >
            <p className="text-nucleo-purple font-medium">
              {currentStep}
            </p>
          </motion.div>
        </motion.div>

        {/* Loading Animation Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex space-x-6"
        >
          {['🧠', '🤖', '🎨', '🌱', '🌍', '⚖️'].map((icon, index) => (
            <motion.div
              key={icon}
              className="text-2xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center text-sm text-gray-500 font-roboto-mono"
        >
          <p>Powered by TensorFlow.js • React • WebRTC • Three.js</p>
          <p className="mt-1">🌍 Hecho con ❤️ para el mundo</p>
        </motion.div>
      </div>

      {/* Background Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-nucleo-yellow rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Bottom Citation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-xs text-gray-400 font-lora italic">
          "La inteligencia artificial al servicio de la transformación social"
        </p>
        <p className="text-xs text-gray-400 font-roboto-mono mt-1">
          Núcleo Colectivo • 2024
        </p>
      </motion.div>
    </div>
  );
};
