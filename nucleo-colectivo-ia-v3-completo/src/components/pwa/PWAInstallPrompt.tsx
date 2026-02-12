import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
        >
          <Card className="p-4 bg-white shadow-lg border-2 border-nucleo-purple">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📱</div>
              <div className="flex-1">
                <h3 className="font-semibold text-nucleo-purple mb-1">
                  ¡Instala Nucleo Colectivo IA!
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Experiencia educativa sin conexión
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="bg-nucleo-purple hover:bg-nucleo-violet text-white"
                  >
                    Instalar
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="outline"
                  >
                    Ahora no
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
