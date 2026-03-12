import React, { useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-0 z-[60] animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-white border-l-4 border-[#ED1C24] shadow-2xl p-5 flex items-start space-x-4 pr-10 min-w-[300px]">
        <div className="mt-0.5">
            <CheckCircleIcon className="w-5 h-5 text-black" />
        </div>
        <div>
            <h4 className="font-bold text-black text-sm uppercase tracking-wide mb-1">Thông báo</h4>
            <p className="text-sm text-gray-600 font-medium">{message}</p>
        </div>
        
        {/* Close button visualization or just visual indicator */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">
             <span className="text-xs font-bold">✕</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;