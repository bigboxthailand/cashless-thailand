import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (event) => {
            const { id, message, type, duration } = event.detail;
            addToast({ id, message, type, duration });
        };

        window.addEventListener('show-toast', handleToast);
        return () => window.removeEventListener('show-toast', handleToast);
    }, []);

    const addToast = (toast) => {
        setToasts((prev) => [...prev, toast]);

        if (toast.duration) {
            setTimeout(() => {
                removeToast(toast.id);
            }, toast.duration);
        }
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="fixed bottom-0 right-0 p-6 z-[100] flex flex-col gap-3 pointer-events-none md:max-w-[420px] w-full">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
}

const ToastItem = ({ toast, onRemove }) => {
    const styles = {
        success: {
            icon: <CheckCircle2 size={20} className="text-green-500" />,
            border: "border-green-500/20",
            bg: "bg-green-500/5",
            titleColor: "text-green-500"
        },
        error: {
            icon: <XCircle size={20} className="text-red-500" />,
            border: "border-red-500/20",
            bg: "bg-red-500/5",
            titleColor: "text-red-500"
        },
        warning: {
            icon: <AlertCircle size={20} className="text-orange-500" />,
            border: "border-orange-500/20",
            bg: "bg-orange-500/5",
            titleColor: "text-orange-500"
        },
        info: {
            icon: <Info size={20} className="text-blue-500" />,
            border: "border-blue-500/20",
            bg: "bg-blue-500/5",
            titleColor: "text-blue-500"
        }
    };

    const style = styles[toast.type] || styles.info;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${style.border} bg-[#111]/90 backdrop-blur-xl p-4 shadow-2xl flex items-start gap-4 pr-10 min-h-[80px]`}
        >
            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-full h-[2px] ${style.bg.replace('/5', '')} opacity-50`} />

            <div className={`mt-0.5 p-2 rounded-xl ${style.bg} border ${style.border}`}>
                {style.icon}
            </div>

            <div className="flex-1 pt-1">
                <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${style.titleColor}`}>
                    {toast.type}
                </h4>
                <p className="text-sm text-white/90 font-medium leading-relaxed">
                    {toast.message}
                </p>
            </div>

            <button
                onClick={() => onRemove(toast.id)}
                className="absolute top-2 right-2 p-2 text-white/30 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};
