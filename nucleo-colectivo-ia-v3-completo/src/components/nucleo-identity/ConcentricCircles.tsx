import React from 'react';
import { motion } from 'framer-motion';

interface ConcentricCirclesProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'purple' | 'yellow' | 'violet' | 'green';
  animated?: boolean;
  className?: string;
}

export const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
  size = 'md',
  color = 'purple',
  animated = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { outer: 60, middle: 40, inner: 20 },
    md: { outer: 100, middle: 70, inner: 40 },
    lg: { outer: 150, middle: 110, inner: 70 },
    xl: { outer: 200, middle: 150, inner: 100 }
  };

  const colorMap = {
    purple: {
      outer: '#9D4EDD',
      middle: '#7B2CBF',
      inner: '#FEE440'
    },
    yellow: {
      outer: '#FEE440',
      middle: '#9D4EDD',
      inner: '#7B2CBF'
    },
    violet: {
      outer: '#7B2CBF',
      middle: '#9D4EDD',
      inner: '#FEE440'
    },
    green: {
      outer: '#06FFA5',
      middle: '#9D4EDD',
      inner: '#7B2CBF'
    }
  };

  const dimensions = sizeMap[size];
  const colors = colorMap[color];

  const containerVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      variants={animated ? containerVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      style={{
        width: dimensions.outer,
        height: dimensions.outer
      }}
    >
      {/* Outer Circle */}
      <motion.div
        className="absolute rounded-full border-4 border-opacity-30"
        variants={animated ? circleVariants : undefined}
        animate={animated ? pulseVariants : undefined}
        style={{
          width: dimensions.outer,
          height: dimensions.outer,
          top: 0,
          left: 0,
          backgroundColor: `${colors.outer}20`,
          borderColor: colors.outer
        }}
      />

      {/* Middle Circle */}
      <motion.div
        className="absolute rounded-full border-4 border-opacity-50"
        variants={animated ? circleVariants : undefined}
        animate={animated ? {
          ...pulseVariants.animate,
          transition: {
            ...pulseVariants.animate.transition,
            delay: 0.5
          }
        } : undefined}
        style={{
          width: dimensions.middle,
          height: dimensions.middle,
          top: (dimensions.outer - dimensions.middle) / 2,
          left: (dimensions.outer - dimensions.middle) / 2,
          backgroundColor: `${colors.middle}30`,
          borderColor: colors.middle
        }}
      />

      {/* Inner Circle */}
      <motion.div
        className="absolute rounded-full border-4 border-opacity-70"
        variants={animated ? circleVariants : undefined}
        animate={animated ? {
          ...pulseVariants.animate,
          transition: {
            ...pulseVariants.animate.transition,
            delay: 1
          }
        } : undefined}
        style={{
          width: dimensions.inner,
          height: dimensions.inner,
          top: (dimensions.outer - dimensions.inner) / 2,
          left: (dimensions.outer - dimensions.inner) / 2,
          backgroundColor: `${colors.inner}40`,
          borderColor: colors.inner
        }}
      />

      {/* Central Nucleus */}
      <motion.div
        className="absolute rounded-full"
        variants={animated ? circleVariants : undefined}
        animate={animated ? {
          scale: [1, 1.3, 1],
          boxShadow: [
            `0 0 0 rgba(157, 78, 221, 0)`,
            `0 0 20px rgba(157, 78, 221, 0.5)`,
            `0 0 0 rgba(157, 78, 221, 0)`
          ],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }
        } : undefined}
        style={{
          width: 12,
          height: 12,
          top: (dimensions.outer - 12) / 2,
          left: (dimensions.outer - 12) / 2,
          background: `linear-gradient(135deg, ${colors.inner}, ${colors.middle})`
        }}
      />

      {/* Connection Points */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radian = (angle * Math.PI) / 180;
        const radius = dimensions.outer / 2 - 10;
        const x = Math.cos(radian) * radius + dimensions.outer / 2;
        const y = Math.sin(radian) * radius + dimensions.outer / 2;

        return (
          <motion.div
            key={angle}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: x - 4,
              top: y - 4,
              backgroundColor: colors.outer
            }}
            animate={animated ? {
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 1, 0.3],
              transition: {
                duration: 4,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }
            } : undefined}
          />
        );
      })}

      {/* Orbital Ring */}
      <motion.div
        className="absolute rounded-full border-2 border-dashed opacity-20"
        style={{
          width: dimensions.outer + 20,
          height: dimensions.outer + 20,
          top: -10,
          left: -10,
          borderColor: colors.outer
        }}
        animate={animated ? {
          rotate: 360,
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        } : undefined}
      />
    </motion.div>
  );
};
