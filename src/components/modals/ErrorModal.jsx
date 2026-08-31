import React from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

/**
 * Reusable error/success modal.
 *
 * Props:
 *  - open        {boolean}  — controls visibility
 *  - onClose     {function} — called when user dismisses
 *  - title       {string}   — heading text  (default: "Something went wrong")
 *  - message     {string}   — full error/success body
 *  - type        {string}   — "error" | "success" (default: "error")
 */
const ErrorModal = ({
  open,
  onClose,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  type = "error",
}) => {
  if (!open) return null;

  const isError = type === "error";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
        style={{ animation: "errModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <style>{`
          @keyframes errModalIn {
            from { opacity: 0; transform: scale(0.92) translateY(20px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
        `}</style>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pt-5 pb-6">
          {/* Icon + title + close */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {isError ? (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-[#78080B]" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}
              <h2 className="text-base font-bold text-slate-800 leading-snug">
                {title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              aria-label="Close modal"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Full message — no truncation */}
          <p className="text-sm text-slate-600 leading-relaxed break-words bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            {message}
          </p>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className={`mt-5 w-full text-white font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm ${
              isError
                ? "bg-[#78080B] hover:bg-[#a01014]"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isError ? "Dismiss" : "Ok"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
