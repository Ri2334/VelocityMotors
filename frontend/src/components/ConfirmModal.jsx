import React from 'react';

const ConfirmModal = ({ isOpen, title = 'Confirm Action', message = 'Are you sure?', onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Modal Card */}
      <div className="bg-brand-900 border border-brand-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-fade-in">
        <h3 className="text-lg font-bold text-brand-100 mb-2">{title}</h3>
        <p className="text-sm text-brand-400 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-brand-300 rounded-xl text-sm font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-brand-50 rounded-xl text-sm font-bold transition-all shadow-md shadow-accent-500/10"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
