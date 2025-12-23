import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, Zap, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useShortcuts, { KeyboardKey } from '@useverse/useshortcuts';
import JSConfetti from 'js-confetti';
import { toast } from 'sonner';

interface Particle {
    id: number;
    x: number;
    y: number;
}

const ApiPlaygroundEasterEgg: React.FC = () => {
    const [isGlitching, setIsGlitching] = useState<boolean>(false);
    const [showSecret, setShowSecret] = useState<boolean>(false);
    const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isDark, setIsDark] = useState<boolean>(true);
    const [currentMessage, setCurrentMessage] = useState<number>(0);
    const jsConfettiRef = useRef<JSConfetti | null>(null);

    const statusMessages: string[] = [
        "{ status: 'coffee_break' }",
        "{ error: 'developer_asleep' }",
        "{ message: 'brb_fixing_prod' }",
        "{ response: '418_im_a_teapot' }",
    ];

    // Initialize JSConfetti once on mount
    useEffect(() => {
        jsConfettiRef.current = new JSConfetti();

        return () => {
            // Cleanup on unmount
            if (jsConfettiRef.current) {
                jsConfettiRef.current.clearCanvas();
            }
        };
    }, []);

    // Konami code: ↑↑↓↓←→←→BA
    const konamiCode = useCallback(() => {
        return [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
    }, []);

    // Map key codes to display symbols
    const keyToSymbol: { [key: string]: string } = {
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'KeyB': 'B',
        'KeyA': 'A'
    };

    const generateParticles = (): void => {
        const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 5000);
    };

    const triggerSecretMode = useCallback((): void => {
        setShowSecret(true);
        generateParticles();

        // Trigger colorful confetti for easter egg unlock
        if (jsConfettiRef.current) {
            jsConfettiRef.current.addConfetti({
                confettiColors: [
                    '#ff0a54', '#ff477e', '#ff7096', '#ff85a1',
                    '#fbb1bd', '#f9bec7', '#FFD700', '#FF6347',
                    '#4169E1', '#32CD32', '#FF69B4', '#00CED1'
                ],
                confettiRadius: 6,
                confettiNumber: 100,
            });
        }

        // Trigger high-five emoji confetti after a short delay
        setTimeout(() => {
            if (jsConfettiRef.current) {
                jsConfettiRef.current.addConfetti({
                    emojis: ['✋', '🖐️', '👋', '🙌', '👌', '✌️', '👏', '👋', '🙌', '👌', '✌️', '✋', '🖐️', '👋', '🙌', '👌', '✌️', '👏', '👋', '🙌', '👌', '✌️'],
                    emojiSize: 200,
                    confettiNumber: 20,
                });
            }
        }, 400);

        setTimeout(() => setShowSecret(false), 5000);
    }, []);

    const handleGoBack = (): void => {
        window.history.back();
    };

    const toggleTheme = (): void => {
        setIsDark(!isDark);
    };

    // Track konami sequence
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.code === 'Escape') {
                setKonamiSequence([]);
                return;
            }
            const konamiSequenceLength = konamiSequence.length;

            if (e.code !== konamiCode()[konamiSequenceLength]) {
                switch(konamiSequenceLength){
                    case 1:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["😂"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("You pressed the wrong key!");
                        break;
                    case 2:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["😂"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("You pressed the wrong key!");
                        break;
                    case 3:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["😂", "😂", "😂"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("You pressed the wrong key!");
                        break;
                    case 4:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["🤏🏾"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("Almost got it!");
                        break;
                    case 5:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["🤏🏾", "🤏🏾", "🤏🏾", "🤏🏾", "🤏🏾"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("Almost got it!");
                        break;
                    case 6:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["🤏🏾", "🤏🏾", "🤏🏾", "🤏🏾", "🤏🏾", "🤏🏾"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("Almost got it!");
                        break;
                    case 7:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["🤯"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("Almost there!");
                        break;
                    case 8:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["🤯", "🤯", "🤯", "🤯", "🤯", "🤯", "🤯", "🤯"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("Almost there!");
                        break;
                    case 9:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["🗿"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("That was close!");
                        break;
                    case 10:
                        if (jsConfettiRef.current) {
                            jsConfettiRef.current.addConfetti({
                                emojis: ["💀", "💀", "💀", "💀", "💀", "💀", "💀", "💀", "💀", "💀"],
                                emojiSize: 200,
                                confettiNumber: 20,
                            });
                        }
                        toast("You almost found the secret!");
                        break;
                }
                setKonamiSequence([]);
                return;
            }

            const newSequence = [...konamiSequence, e.code].slice(-10);
            setKonamiSequence(newSequence);

            if (JSON.stringify(newSequence) === JSON.stringify(konamiCode())) {
                triggerSecretMode();
                setKonamiSequence([]); // Reset after success
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [konamiSequence, konamiCode, triggerSecretMode]);

    useShortcuts({
        shortcuts: [
            { key: KeyboardKey.KeyT, ctrlKey: true, enabled: true }, // Ctrl+T for theme
            { key: KeyboardKey.KeyT, metaKey: true, enabled: true }, // CMD+T for theme
            { key: KeyboardKey.KeyH, ctrlKey: true, shiftKey: true, enabled: true }, // Ctrl+Shift+H for secret
            { key: KeyboardKey.Escape, isSpecialKey: true, enabled: showSecret }, // ESC to close secret
        ],
        onTrigger: (shortcut) => {
            if (shortcut.key === KeyboardKey.KeyT) {
                toggleTheme();
            } else if (shortcut.key === KeyboardKey.KeyH) {
                triggerSecretMode();
            } else if (shortcut.key === KeyboardKey.Escape) {
                setShowSecret(false);
            }
        }
    }, [showSecret, toggleTheme, triggerSecretMode]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.95) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 200);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const msgInterval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % statusMessages.length);
        }, 3000);
        return () => clearInterval(msgInterval);
    }, [statusMessages.length]);

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(${isDark ? '#3b82f6' : '#6366f1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#3b82f6' : '#6366f1'} 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            {/* Particles */}
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute w-2 h-2 bg-blue-500 rounded-full"
                        initial={{ x: `${particle.x}vw`, y: `${particle.y}vh`, opacity: 1, scale: 0 }}
                        animate={{
                            y: '-100vh',
                            opacity: 0,
                            scale: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`absolute top-6 right-6 z-50 p-3 rounded-full ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-900'} shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                aria-label="Toggle theme"
                title="Ctrl+T to toggle"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
                <div className="max-w-2xl w-full">
                    {/* Main Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: isGlitching ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{ duration: 0.6 }}
                        className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl border-2 shadow-2xl p-8 relative overflow-hidden`}
                    >
                        {/* Glitch Effect Overlay */}
                        {isGlitching && (
                            <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse" />
                        )}

                        {/* Terminal Header */}
                        <div className="flex items-center gap-2 mb-8">
                            <motion.div
                                animate={{ filter: 'hue-rotate(360deg)' }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            >
                                <Terminal className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
                            </motion.div>
                            <div className={`font-mono text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                ~/dashboard/playground
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-6">
                            <motion.h1
                                className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} font-mono`}
                                animate={{
                                    textShadow: isGlitching
                                        ? ['0 0 10px #3b82f6', '0 0 20px #3b82f6', '0 0 10px #3b82f6']
                                        : '0 0 0px transparent',
                                }}
                            >
                                503
                                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} animate-pulse`}>_</span>
                            </motion.h1>

                            <h2 className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>
                                Playground Unavailable
                            </h2>

                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed`}>
                                The API playground is currently taking a well-deserved break in production.
                                Testing is for development environments only! 🚀
                            </p>

                            {/* Status Console */}
                            <div className={`${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-300'} rounded-lg p-6 border font-mono text-sm`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <span className={`${isDark ? 'text-gray-500' : 'text-gray-600'}`}>console.log()</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className={`${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{'> '}</span>
                                    <motion.div
                                        key={currentMessage}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`${isDark ? 'text-green-400' : 'text-green-600'}`}
                                    >
                                        {statusMessages[currentMessage]}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGoBack}
                                    className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg font-semibold transition-colors cursor-pointer`}
                                >
                                    <Zap size={18} />
                                    Go Back
                                </motion.button>
                            </div>

                            {/* Easter Egg Hints */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'} font-mono pt-4 space-y-1`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>💡 Try the Konami code:</span>
                                    <span className="inline-flex gap-0.5">
                                        {konamiCode().map((key, index) => {
                                            const isTyped = index < konamiSequence.length && konamiSequence[index] === key;
                                            const isCurrentPosition = index === konamiSequence.length && 
                                                konamiSequence.slice(0, index).every((k, i) => k === konamiCode()[i]);
                                            
                                            return (
                                                <motion.span
                                                    key={index}
                                                    className={`inline-block transition-all duration-200 ${
                                                        isTyped
                                                            ? isDark 
                                                                ? 'text-green-400 font-bold scale-110' 
                                                                : 'text-green-600 font-bold scale-110'
                                                            : isCurrentPosition
                                                                ? isDark
                                                                    ? 'text-yellow-400 animate-pulse'
                                                                    : 'text-yellow-600 animate-pulse'
                                                                : isDark
                                                                    ? 'text-gray-600'
                                                                    : 'text-gray-400'
                                                    }`}
                                                    animate={isTyped ? { scale: [1, 1.2, 1] } : {}}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {keyToSymbol[key]}
                                                </motion.span>
                                            );
                                        })}
                                    </span>
                                </div>
                                <div>⌨️ Shortcuts: Ctrl+T (theme) • Ctrl+Shift+H (secret)</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Secret Message */}
                    <AnimatePresence>
                        {showSecret && (
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                className="mt-6 bg-linear-to-r fixed shadow-2xl shadow-black/25 from-blue-600 to-blue-700 rounded-2xl p-6 text-center left-1/2 -translate-x-1/2 top-0"
                            >
                                <button
                                    onClick={() => setShowSecret(false)}
                                    className="absolute top-3 right-3 text-white/80 hover:text-white text-sm cursor-pointer"
                                >
                                    ESC
                                </button>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    🎉 Secret Unlocked! 🎉
                                </h3>
                                <p className="text-purple-100">
                                    You found the easter egg! Here&apos;s a virtual high-five from the dev team! ✋
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={`text-center mt-8 ${isDark ? 'text-gray-600' : 'text-gray-500'} text-sm`}
                    >
                        <p>Error Code: PLAYGROUND_PROD_NO_NO</p>
                        <p className="mt-2">Switch to dev environment to test APIs</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ApiPlaygroundEasterEgg;