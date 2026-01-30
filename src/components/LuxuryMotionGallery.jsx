// src/components/LuxuryMotionGallery.jsx
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

// ฟังก์ชันสำหรับทำซ้ำ Array เพื่อให้การ Loop ไม่มีที่สิ้นสุด
const shuffle = (arr) => [...arr, ...arr, ...arr];

function ImageCard({ src }) {
  return (
    <div className="
      relative h-[25vh] min-h-[200px] max-h-[350px] aspect-[4/3]
      rounded-2xl overflow-hidden
      border-[1px] border-white/10
      shadow-[0_0_30px_-10px_rgba(212,175,55,0.3)] // เงาสีทองฟุ้งๆ
      group
    ">
       {/* แสงสะท้อนบนกระจก */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay"></div>

      <img
        src={src}
        alt="Gallery"
        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out"
        loading="lazy"
      />
      {/* Gradient ทับบางๆ ให้ดูแพง */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent"></div>
    </div>
  );
}

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden m-0 flex flex-nowrap whitespace-nowrap">
      <motion.div className="scroller flex whitespace-nowrap gap-[2vw]" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Helper function สำหรับ loop
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};


export default function LuxuryMotionGallery({ images }) {
  const shuffledImages = shuffle(images);

  return (
    <section className="relative w-full overflow-hidden py-20 perspective-1000">
      {/* Background Tech Element */}
       <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-5 pointer-events-none fixed"></div>

       {/* Row 1: วิ่งไปทางซ้าย + เอียง 3D */}
      <div className="transform -rotate-[2deg] -translate-x-[10%] scale-110 origin-center hover:opacity-90 transition-opacity duration-500">
        <ParallaxText baseVelocity={-2}>
            {shuffledImages.map((src, i) => (
                <ImageCard key={`row1-${i}`} src={src} />
            ))}
        </ParallaxText>
      </div>

       {/* Row 2: วิ่งสวนไปทางขวา + เอียง 3D สวนทาง */}
      <div className="transform rotate-[3deg] translate-x-[5%] scale-110 origin-center mt-8 hover:opacity-90 transition-opacity duration-500">
        <ParallaxText baseVelocity={1.5}>
           {shuffledImages.map((src, i) => (
               <ImageCard key={`row2-${i}`} src={src} />
            ))}
        </ParallaxText>
      </div>
        {/* Vignette effect ขอบดำ */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient-to-t from-[#050505] via-transparent to-[#050505]/80"></div>
    </section>
  );
}