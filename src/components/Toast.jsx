import React, { useEffect, useState } from 'react';

export default function Toast({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for transition before invoking callback
    setTimeout(onClose, 400);
  };

  if (!message) return null;

  return (
    <div 
      className={`fixed top-6 right-6 z-[1000] pointer-events-auto bg-[#120b21]/85 border border-red-500/30 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(239,68,68,0.1)] rounded-2xl p-4 flex items-center gap-3.5 max-w-[340px] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      }`}
      role="alert"
    >
      <span className="text-xl text-red-500 shrink-0">❌</span>
      <span className="text-sm font-medium text-brand-primary leading-snug">{message}</span>
      <button 
        onClick={handleClose}
        className="bg-transparent border-none text-brand-secondary hover:text-white cursor-pointer text-lg ml-auto flex items-center justify-center"
      >
        &times;
      </button>
    </div>
  );
}
