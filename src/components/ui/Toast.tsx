'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/utils/cn';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastComponentProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastComponent({ toast, onRemove }: ToastComponentProps) {
  const typeStyles = {
    success: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800 shadow-emerald-100',
    error: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 shadow-red-100',
    warning: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 shadow-amber-100',
    info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 shadow-blue-100'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border-2 p-4 shadow-xl backdrop-blur-sm transition-all duration-500 ease-out animate-in slide-in-from-right-full',
        typeStyles[toast.type]
      )}
    >
      <span className="text-lg">{icons[toast.type]}</span>
      <span className="text-sm font-semibold flex-1">{toast.message}</span>
      <button
        onClick={onRemove}
        className="ml-2 p-1 rounded-full hover:bg-white/50 transition-colors opacity-70 hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
