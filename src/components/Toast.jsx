import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', show, onDismiss }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000); // The toast will disappear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  const baseStyle = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-500";
  const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const visibilityStyle = show ? 'opacity-100' : 'opacity-0 pointer-events-none';

  return (
    <div className={`${baseStyle} ${typeStyle} ${visibilityStyle}`} style={{ zIndex: 1000 }}>
      {message}
    </div>
  );
};

export default Toast;
