import React from 'react';

interface OfficialNucleoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const OfficialNucleoLogo: React.FC<OfficialNucleoLogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/logos/nucleo-colectivo-logo-official.png"
        alt="Núcleo Colectivo"
        className={`${sizeClasses[size]} object-contain drop-shadow-lg`}
      />
    </div>
  );
};
