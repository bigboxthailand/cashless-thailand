import React from 'react';
import { motion } from 'framer-motion';
import { Store, FileText, CheckCircle2, LayoutDashboard, Globe, ChevronDown } from 'lucide-react';

const SellerFlow = () => {
    const phases = [
        {
            icon: <Store size={28} />,
            title: "ลงทะเบียนร้านค้า",
            desc: "กรอกรายละเอียดแบรนด์และข้อมูลร้าน",
            color: "#D4AF37"
        },
        {
            icon: <FileText size={28} />,
            title: "รอการตรวจสอบ",
            desc: "แอดมินกำลังพิจารณาคำขอของคุณ",
            color: "#666"
        },
        {
            icon: <CheckCircle2 size={28} />,
            title: "ยืนยันตัวตนสำเร็จ",
            desc: "อนุมัติร้านค้า สถานะพร้อมใช้งาน",
            color: "#22c55e"
        },
        {
            icon: <LayoutDashboard size={28} />,
            title: "เริ่มขายสินค้า",
            desc: "เข้าสู่ระบบจัดการหน้าร้านได้ทันที",
            color: "#D4AF37"
        }
    ];

    return (
        <div className="space-y-12 py-10">
            <div className="relative flex flex-col items-center">
                {phases.map((phase, index) => (
                    <div key={index} className="flex items-center w-full max-w-4xl group">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: index * 0.3, type: "spring", stiffness: 260, damping: 20 }}
                                viewport={{ once: true }}
                                className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center relative z-10 group-hover:border-[#D4AF37] transition-all"
                                style={{ boxShadow: `0 0 40px ${phase.color}11` }}
                            >
                                <div style={{ color: phase.color }}>{phase.icon}</div>
                            </motion.div>

                            {/* Vertical Connector with Moving Light */}
                            {index < phases.length - 1 && (
                                <motion.div
                                    className="w-1 bg-[#222] my-2 relative overflow-hidden rounded-full"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 100 }}
                                    transition={{ delay: index * 0.3 + 0.2, duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent"
                                        animate={{ top: ["-50%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#D4AF37] opacity-50">
                                        <ChevronDown size={12} />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Content Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.3 + 0.1, duration: 1 }}
                            viewport={{ once: true }}
                            className="ml-12 flex-1 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all hover:translate-x-2"
                        >
                            <div className="flex justify-between items-center">
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-white italic tracking-wide">{phase.title}</h4>
                                    <p className="text-white/40 text-base font-light">{phase.desc}</p>
                                </div>
                                <div className="text-xs font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 rounded-full uppercase tracking-widest opacity-60">
                                    ขั้นตอนที่ 0{index + 1}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            <motion.div
                className="pt-12 flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-[0.3em]">
                    <Globe size={16} className="animate-spin" style={{ animationDuration: '10s' }} />
                    Global Vendor Ready
                </div>
            </motion.div>
        </div>
    );
};

export default SellerFlow;
