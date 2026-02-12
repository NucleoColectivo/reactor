import React from 'react';
import { cn } from '../../lib/utils';

interface NucleoLogoProps {
  variant?: 'full' | 'compact' | 'hero';
  className?: string;
  onClick?: () => void;
}

export const NucleoLogo: React.FC<NucleoLogoProps> = ({ 
  variant = 'full', 
  className = '',
  onClick 
}) => {
  const getLogoStyles = () => {
    switch (variant) {
      case 'hero':
        return 'h-32 md:h-48 w-auto'; // Logo grande para pantalla principal
      case 'compact':
        return 'h-12 w-auto'; // Logo compacto para header
      case 'full':
      default:
        return 'h-20 md:h-24 w-auto'; // Logo tamaño estándar
    }
  };

  const containerStyles = cn(
    'flex items-center justify-center',
    onClick && 'cursor-pointer transition-transform hover:scale-105',
    className
  );

  return (
    <div className={containerStyles} onClick={onClick}>
      <img
        src="/logos/nucleo-colectivo-logo-full.png"
        alt="Núcleo Colectivo"
        className={cn(
          'object-contain transition-all duration-300',
          getLogoStyles()
        )}
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
};