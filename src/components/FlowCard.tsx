import React from 'react';
// import { useDrag } from 'react-use-gesture'; 
// We are using framer-motion for drag logic in this iteration to keep it simple with animations.
// Actually, let's keep it clean.

import { motion, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { Card, Sentence } from '../db/db';
import { PitchVisualizer } from './ui/PitchVisualizer';
import { Repeat, MessageCircle } from 'lucide-react';



interface FlowCardProps {
    card: Card;
    onReview: (card: Card) => void;
    sentence?: Sentence | null;
    onExport?: (card: Card, sentence?: Sentence | null) => void;
    backgroundImageUrl?: string;
}


export const FlowCard: React.FC<FlowCardProps> = ({ card, onReview, sentence, onExport, backgroundImageUrl }) => {

    const controls = useAnimation();

    // Swipe Logic
    const handleDragEnd = async (_: any, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -100 || velocity < -500) {
            // Swipe Left (Review)
            await controls.start({ x: -200, opacity: 0, transition: { duration: 0.2 } });
            onReview(card);
            controls.set({ x: 0, opacity: 1 });
        } else {
            // Snap back
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    return (
        <div className="w-full h-[100dvh] snap-start flex items-center justify-center relative overflow-hidden group">
            {/* Background Image with Parallax-like Feel */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[10s] ease-linear group-hover:scale-110"
                style={{ backgroundImage: card.imagePath ? `url(${card.imagePath})` : backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined }}
            >
                {!card.imagePath && !backgroundImageUrl && (
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-kachimushiro to-black" />
                )}
            </div>

            {/* Cinematic Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-kachimushiro/95 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />

            {/* Glassmorphism Card Content */}
            <motion.div
                className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 pb-32 space-y-12"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
            >
                {/* Export Button (Fallback if no sentence) */}
                {!sentence && onExport && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onExport(card, sentence);
                        }}
                        className="absolute top-0 right-8 p-3 bg-black/30 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors backdrop-blur-md border border-white/5 z-50 uppercase text-xs tracking-widest"
                        title="Export to Anki"
                    >
                        ANKI
                    </button>
                )}

                {/* Kanji with dramatic shadow */}
                {/* Kanji / Sentence Display */}
                <div className="flex flex-col items-center space-y-6 transform transition-all duration-500 w-full max-w-4xl px-8">
                    <h2
                        className={`text-center font-jp font-bold text-white drop-shadow-2xl tracking-wide select-text cursor-text leading-relaxed z-50
                        ${card.word.length > 20 ? "text-2xl" : card.word.length > 10 ? "text-3xl" : card.word.length > 4 ? "text-5xl" : "text-[5rem]"}
                        `}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {card.word}
                    </h2>

                    {/* Reading Visualization */}
                    <div className="relative pt-6">
                        {/* Visualizer gets its own glow */}
                        <div className="filter drop-shadow-[0_0_8px_rgba(230,0,51,0.5)]">
                            {card.pitch && <PitchVisualizer text={card.reading} pitch={card.pitch} />}
                        </div>
                        <div className="text-2xl font-sans tracking-[0.2em] uppercase text-sakura-pink/80 text-center mt-4 border-t border-white/10 pt-4">
                            {card.reading}
                        </div>
                    </div>
                </div>

                {/* Meaning - Elegant Reveal */}
                <div className="text-3xl font-jp font-bold text-center text-white/90 drop-shadow-md bg-black/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/5">
                    {card.meaning}
                </div>

                {/* Galgame Dialogue Box (Context Sentence) */}
                <AnimatePresence>
                    {sentence && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-32 w-[90%] max-w-lg"
                        >
                            <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden group/sentence">
                                {/* Decor line */}
                                <div className="absolute left-0 top-0 h-full w-1 bg-torii-red" />

                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sakura-pink text-xs font-bold uppercase tracking-widest opacity-80">
                                            <MessageCircle size={12} />
                                            <span>Scene Context</span>
                                        </div>

                                        {/* Anki Button in Context */}
                                        {onExport && (
                                            <button
                                                onMouseDown={(e) => e.preventDefault()} // Prevent focus loss on click
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const selection = window.getSelection();
                                                    const selectedText = selection ? selection.toString() : '';
                                                    console.log("Export Selection:", selectedText); // Debug

                                                    // Clone sentence if we have one, overriding text if selection exists
                                                    let exportSentence = sentence;
                                                    if (selectedText && sentence) {
                                                        // Optimization: Check if selection is actually part of this sentence logic if needed
                                                        // For now, assume user knows what they are selecting
                                                        exportSentence = { ...sentence, text: selectedText };
                                                    }

                                                    onExport(card, exportSentence);
                                                }}
                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500 border border-indigo-500/30 hover:border-indigo-400 transition-all text-xs font-bold text-indigo-300 hover:text-white"
                                            >
                                                <span>ANKI</span>
                                                <span className="text-[10px] opacity-50 block sm:hidden">Export</span>
                                            </button>
                                        )}
                                    </div>

                                    <p
                                        className="text-xl font-jp font-medium leading-relaxed text-white drop-shadow-md pr-12 select-text cursor-text"
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        {sentence.text}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Interactive Hints */}
                <div className="absolute bottom-12 flex flex-col items-center gap-3 animate-pulse-slow">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                    <div className="text-xs font-sans tracking-widest uppercase opacity-40 text-white">Swipe Up</div>

                    <div className="absolute left-8 bottom-0 flex items-center gap-2 opacity-30 transition-opacity duration-300 hover:opacity-100">
                        <Repeat className="text-torii-red w-4 h-4" />
                        <span className="text-xs font-sans tracking-widest uppercase">Review</span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

