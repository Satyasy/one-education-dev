import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Loading...', 
  size = 'md' 
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 p-8 bg-white">
        {/* Beautiful animated spinner */}
        <div className={`animate-spin ${sizeClasses[size]}`}>
          <svg
            className="text-brand-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        {/* Loading message */}
        <p className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 text-center max-w-sm`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 