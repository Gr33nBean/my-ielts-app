import React from "react";
import ReactDOM from "react-dom";

/**
 * Base Modal Component
 * Provides a consistent modal experience across the application
 * Uses React Portal to render outside parent DOM hierarchy
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} showCloseButton - Show/hide close button (default: true)
 * @param {boolean} closeOnBackdropClick - Allow closing by clicking backdrop (default: true)
 * @param {string} className - Additional classes for modal content
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
  titleClassName = "",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-slate-900 w-full ${sizeClasses[size]} rounded-t-[32px] md:rounded-[32px] p-6 pb-safe relative animate-in slide-in-from-bottom-5 duration-300 shadow-2xl max-h-[90vh] flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag indicator */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 md:hidden"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-black tracking-tight ${titleClassName || "text-slate-800 dark:text-white"}`}
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold transition-all active:scale-90"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2 pb-8">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal using Portal to document.body
  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
