'use client'

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, type = "success", show, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onHide, duration]);

  if (!show) return null;

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const hoverColor = type === "success" ? "hover:bg-green-600" : type === "error" ? "hover:bg-red-600" : "hover:bg-blue-600";

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${bgColor} ${hoverColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-200 hover:scale-105 cursor-pointer`} onClick={onHide}>
        <div className="flex-shrink-0">
          {type === "success" && (
            <svg className="w-5 h-5 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {type === "error" && (
            <svg className="w-5 h-5 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          {type === "info" && (
            <svg className="w-5 h-5 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className="font-medium flex-1">{message}</span>
        <button onClick={onHide} className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}