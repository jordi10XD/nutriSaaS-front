import React from 'react';
import { X } from 'lucide-react';

const ModalForm = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 brand-font">{title}</h3>
        <div className="mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-2"></div>
        {children}
      </div>
    </div>
  );
};

export default ModalForm;