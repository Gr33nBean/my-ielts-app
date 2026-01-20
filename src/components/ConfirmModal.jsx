import React from "react";
import Modal from "./Modal";

/**
 * Confirmation Modal
 * A specialized modal for confirmation dialogs
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed/cancelled
 * @param {function} onConfirm - Callback when user confirms
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "Xác nhận")
 * @param {string} cancelText - Text for cancel button (default: "Hủy")
 * @param {string} variant - Visual variant: 'danger' | 'warning' | 'info' (default: 'info')
 * @param {boolean} loading - Show loading state on confirm button
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "info",
  loading = false,
}) => {
  const variantStyles = {
    danger: {
      button:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-none",
      icon: "⚠️",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
    },
    warning: {
      button:
        "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 dark:shadow-none",
      icon: "⚡",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    info: {
      button:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none",
      icon: "ℹ️",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
  };

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdropClick={!loading}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}
          >
            {style.icon}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
            {message}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 ${style.button}`}
          >
            {loading ? "ĐANG XỬ LÝ..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
