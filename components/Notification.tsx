'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbX, TbInfoCircle, TbCheck, TbExclamationMark } from 'react-icons/tb';

interface NotificationProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function Notification({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoHide = true,
  duration = 5000
}: NotificationProps) {
  
  useEffect(() => {
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-500',
          title: 'text-green-800',
          message: 'text-green-700',
          IconComponent: TbCheck
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-500',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          IconComponent: TbExclamationMark
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          IconComponent: TbExclamationMark
        };
      default: // info
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700',
          IconComponent: TbInfoCircle
        };
    }
  };

  const styles = getTypeStyles();
  const { IconComponent } = styles;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-4 right-4 z-50 max-w-md w-full ${styles.bg} border rounded-lg shadow-lg p-4`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconComponent className={`h-5 w-5 ${styles.icon}`} />
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${styles.title}`}>
                {title}
              </h3>
              <div className={`mt-1 text-sm ${styles.message}`}>
                <p>{message}</p>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md ${styles.message} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span className="sr-only">Close</span>
                <TbX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
