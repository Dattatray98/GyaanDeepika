// components/Loader.tsx
// components/Loader.tsx
import type { HTMLAttributes } from 'react';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader = ({ 
  message = 'Loading Knowledge...', 
  size = 'md', 
  className,
  ...props 
}: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const petalSize = {
    sm: 'w-5 h-2.5',
    md: 'w-7 h-3.5',
    lg: 'w-10 h-5',
  };

  const bookSize = {
    sm: 'w-6 h-8',
    md: 'w-8 h-10',
    lg: 'w-12 h-14',
  };

  const centerSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      {...props}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Book */}
        <div 
          className={`absolute bg-emerald-500 rounded-sm ${bookSize[size]} top-1/4 left-1/3 transform rotate-6 
                     animate-[pulse_1.5s_infinite_alternate]`}
        />
        
        {/* Petals */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`absolute bg-amber-300 rounded-t-full ${petalSize[size]} 
                       origin-bottom animate-[rotate_2s_infinite]`}
            style={{
              top: i % 2 === 0 ? '37.5%' : i === 1 ? '25%' : '50%',
              left: i % 2 === 0 ? (i === 2 ? '62.5%' : '37.5%') : '50%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        
        {/* Center */}
        <div 
          className={`absolute bg-orange-500 rounded-full ${centerSize[size]} top-2/4 left-2/4 
                     animate-[pulse_1s_infinite_alternate]`}
        />
      </div>
      
      {/* Text */}
      <p className="mt-4 text-gray-700 text-sm md:text-base font-medium text-center">
        {message}
      </p>
    </div>
  );
};