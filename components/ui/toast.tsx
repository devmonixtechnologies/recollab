'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />
};

const toastStyles = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-yellow-200 bg-yellow-50',
  info: 'border-blue-200 bg-blue-50'
};

function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        toastStyles[toast.type]
      )}
    >
      <div className="flex-shrink-0">
        {toastIcons[toast.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="mt-1 text-sm text-gray-600">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-gray-200 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </motion.div>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastComponent
              key={toast.id}
              toast={toast}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const ToastContext = React.createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {}
});

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Hook for easy toast creation
export function useToastHelpers() {
  const { addToast } = useToast();

  return {
    success: (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
    custom: (toast: Omit<Toast, 'id'>) => addToast(toast)
  };
}
