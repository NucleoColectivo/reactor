import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../ui/card';

interface NotificationData {
  id: string;
  achievement: any;
  timestamp: number;
}

export const AchievementNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { achievements } = useGameStore();

  // Monitor for new achievements
  useEffect(() => {
    // This would typically listen for new achievements being added
    // For now, it's a placeholder system
  }, [achievements]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-80"
          >
            <Card className="p-4 bg-gradient-to-r from-nucleo-yellow to-nucleo-purple text-white">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🏆</div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">¡Logro Desbloqueado!</h3>
                  <p className="text-xs opacity-90">{notification.achievement.name}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
