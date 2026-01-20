import React from "react";
import Modal from "./Modal";

/**
 * Form Modal
 * A specialized modal for forms with submit/cancel actions
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed
 * @param {function} onSubmit - Callback when form is submitted
 * @param {string} title - Modal title
 * @param {ReactNode} children - Form content
 * @param {string} submitText - Text for submit button (default: "Lưu")
 * @param {string} cancelText - Text for cancel button (default: "Hủy")
 * @param {boolean} loading - Show loading state
 * @param {boolean} showCancelButton - Show cancel button (default: true)
 * @param {string} size - Modal size
 */
const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = "Lưu",
  cancelText = "Hủy",
  loading = false,
  showCancelButton = true,
  size = "md",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnBackdropClick={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">{children}</div>

        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {showCancelButton && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95 disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`${showCancelButton ? "flex-1" : "w-full"} py-3 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-200 dark:shadow-none"}`}
          >
            {loading ? "ĐANG XỬ LÝ..." : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
