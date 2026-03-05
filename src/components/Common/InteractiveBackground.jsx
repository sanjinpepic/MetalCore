import React, { useEffect, useState, useMemo } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const FossilParticle = ({ p, x, y }) => {
    const px = useTransform(x, (val) => val * p.parallaxFactor);
    const py = useTransform(y, (val) => val * p.parallaxFactor);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, p.opacity, p.opacity * 0.6, p.opacity, 0],
                x: p.xOffset.map(val => `calc(${p.x}% + ${val}vw)`),
                y: p.yOffset.map(val => `calc(${p.y}% + ${val}vh)`)
            }}
            style={{
                x: px,
                y: py,
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                backgroundColor: 'white',
                filter: p.blur,
                boxShadow: '0 0 12px rgba(255,255,255,0.4)',
                willChange: 'transform, opacity'
            }}
            transition={{
                duration: p.speed,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            }}
            className="absolute rounded-full"
        />
    );
};

const InteractiveBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [mounted, setMounted] = useState(false);

    const springConfig = { damping: 30, stiffness: 200 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Inverse movements for the second glow to create depth
    const invX = useTransform(x, (val) => -val * 1.5);
    const invY = useTransform(y, (val) => -val * 1.5);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const moveX = (clientX - window.innerWidth / 2) / 10;
            const moveY = (clientY - window.innerHeight / 2) / 10;
            mouseX.set(moveX);
            mouseY.set(moveY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Generate random particles (representing carbides/atoms)
    const particles = useMemo(() => {
        if (!mounted) return [];
        return Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            // Generate multiple keyframes for organic floating (vw/vh offsets)
            xOffset: [0, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
            yOffset: [0, -(Math.random() * 15 + 5), -(Math.random() * 25 + 10), -(Math.random() * 35 + 15)],
            size: Math.random() * 2.5 + 1.0, // 1px to 3.5px
            opacity: Math.random() * 0.4 + 0.2, // 20% to 60% opacity
            blur: `blur(${Math.random() * 2 + 0.5}px)`, // Variable depth of field
            speed: Math.random() * 30 + 20, // Very slow: 20s to 50s per cycle
            parallaxFactor: Math.random() * 0.4 + 0.1
        }));
    }, [mounted]);

    if (!mounted) {
        return <div className="fixed inset-0 z-0 bg-[#020203]" />;
    }

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020203]">
            {/* Ambient Glows - Layered */}
            <motion.div
                style={{ x, y }}
                className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-accent/10 rounded-full blur-[150px] opacity-70"
            />

            <motion.div
                style={{ x: invX, y: invY }}
                className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[150px] opacity-60"
            />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Vingette Overlay (Under particles to act as backdrop) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60" />

            {/* Particle Layer with subtle parallax (Above vignette so they don't get darkened) */}
            <div className="absolute inset-0">
                {particles.map((p) => (
                    <FossilParticle key={p.id} p={p} x={x} y={y} />
                ))}
            </div>
        </div>
    );
};

export default InteractiveBackground;
