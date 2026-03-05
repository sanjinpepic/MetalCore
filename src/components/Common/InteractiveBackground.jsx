import React, { useEffect, useState, useMemo } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const FossilParticle = ({ p, x, y }) => {
    const px = useTransform(x, (val) => val * p.parallaxFactor);
    const py = useTransform(y, (val) => val * p.parallaxFactor);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, p.opacity, 0],
                y: [`${p.y}%`, `${(p.y - 40 + 100) % 100}%`]
            }}
            style={{
                x: px,
                y: py,
                position: 'absolute',
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                backgroundColor: 'white',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 8px rgba(255,255,255,0.3)'
            }}
            transition={{
                duration: p.speed,
                repeat: Infinity,
                ease: "linear",
                opacity: { duration: p.speed, repeat: Infinity, times: [0, 0.5, 1] }
            }}
            className="absolute"
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
        return Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.2 + 0.05,
            speed: Math.random() * 10 + 15,
            parallaxFactor: Math.random() * 0.5 + 0.2 // For subtle mouse reaction
        }));
    }, [mounted]);

    if (!mounted) {
        return <div className="fixed inset-0 z-0 bg-black" />;
    }

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020203]">
            {/* Ambient Glows - Layered */}
            <motion.div
                style={{ x, y }}
                className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-accent/5 rounded-full blur-[150px] opacity-60"
            />

            <motion.div
                style={{ x: invX, y: invY }}
                className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[150px] opacity-40"
            />

            {/* Particle Layer with subtle parallax */}
            <div className="absolute inset-0">
                {particles.map((p) => (
                    <FossilParticle key={p.id} p={p} x={x} y={y} />
                ))}
            </div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Vingette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-40" />
        </div>
    );
};

export default InteractiveBackground;
