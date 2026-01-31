import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Wallet, Database, ShieldCheck, UserCircle, Zap, ArrowRight } from 'lucide-react';

const RegistrationFlow = () => {
    const steps = [
        {
            icon: <div className="flex gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/40"><Mail size={24} /></div>
                <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37]"><Wallet size={24} /></div>
            </div>,
            title: "เลือกตัวตนของคุณ",
            desc: "ใช้อีเมล (Web2) หรือ เชื่อมต่อกระเป๋า (Web3)"
        },
        {
            icon: <Database className="text-[#D4AF37]" size={36} />,
            title: "ยืนยันตัวตนกับระบบ",
            desc: "บันทึกข้อมูลและสร้าง Session ความปลอดภัย"
        },
        {
            icon: <UserCircle className="text-[#D4AF37]" size={36} />,
            title: "สร้างโปรไฟล์เริ่มต้น",
            desc: "รับคะแนนแรกเข้าและรูปอวตารประจำตัว"
        },
        {
            icon: <ShieldCheck className="text-green-500" size={36} />,
            title: "กำหนดระดับสมาชิก",
            desc: "เริ่มต้นที่ Bronze พร้อมช้อปได้ทันที"
        }
    ];

    return (
        <div className="relative py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center space-y-6 group"
                    >
                        <div className="relative">
                            <motion.div
                                className="w-28 h-28 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center relative z-20 group-hover:border-[#D4AF37]/50 transition-colors shadow-2xl"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                {step.icon}
                            </motion.div>
                            {/* Connector Line with Moving Arrow for desktop */}
                            {index < steps.length - 1 && (
                                <>
                                    <div className="absolute top-1/2 left-full w-full h-12 flex items-center justify-center hidden md:flex z-0 transform -translate-y-1/2 -ml-4">
                                        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                                            <motion.div
                                                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                                                animate={{ left: ["-50%", "100%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                        <motion.div
                                            className="absolute text-[#D4AF37]"
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <ArrowRight size={20} />
                                        </motion.div>
                                    </div>

                                    {/* Vertical Arrow for Mobile */}
                                    <div className="md:hidden absolute -bottom-12 left-1/2 -translate-x-1/2 text-[#D4AF37]/50 animate-bounce z-10">
                                        <ArrowRight size={20} className="rotate-90" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-white font-black text-xl tracking-wide">{step.title}</h4>
                            <p className="text-white/40 text-base leading-relaxed max-w-[200px] mx-auto font-light">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />

            <motion.div
                className="mt-24 flex justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <div className="px-8 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full flex items-center gap-4 hover:bg-[#D4AF37]/20 transition-all cursor-crosshair">
                    <Zap className="text-[#D4AF37]" size={20} />
                    <span className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">ประสิทธิภาพ: ยืนยันใน 2.1 วินาที</span>
                </div>
            </motion.div>
        </div>
    );
};

export default RegistrationFlow;
