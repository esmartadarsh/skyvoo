import React from "react";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children }) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 p-4"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
        >
            <div
                className="bg-white w-full sm:max-w-lg max-h-[90vh] rounded-2xl sm:rounded-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
