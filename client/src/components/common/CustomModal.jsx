import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Check } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden border border-border"
          >
            <div className={`h-1.5 w-full ${type === 'warning' ? 'bg-gold' : 'bg-green-500'}`} />
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-full ${type === 'warning' ? 'bg-gold/10 text-gold' : 'bg-green-100 text-green-600'}`}>
                  {type === 'warning' ? <AlertCircle size={24} /> : <Check size={24} />}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
                  <X size={20} className="text-muted" />
                </button>
              </div>

              <h3 className="text-2xl serif text-black mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light mb-10">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 px-8 py-4 bg-accent text-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  {cancelText}
                </button>
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-8 py-4 text-white text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'warning' ? 'bg-black hover:bg-gold' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
