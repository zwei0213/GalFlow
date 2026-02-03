import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Card, Sentence } from '../db/db';

import { seedDatabase } from '../db/seedData';
import { FlowCard } from './FlowCard';
import { calculateNextReview } from '../utils/srs';
import { Settings } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { Howl } from 'howler';


export const FlowDeck: React.FC = () => {
    const cards = useLiveQuery(() => db.cards.toArray());
    const resources = useLiveQuery(() => db.resources.toArray());
    const [initialized, setInitialized] = useState(false);

    // Audio ref to handle stopping
    const activeHowlRef = React.useRef<Howl | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeSentence, setActiveSentence] = useState<Sentence | null>(null);


    useEffect(() => {
        const init = async () => {
            await seedDatabase();
            setInitialized(true);
        };
        init();
    }, []);

    // Audio Player
    useEffect(() => {
        if (!cards || !resources || cards.length === 0) return;

        const card = cards[activeIndex];
        if (!card) return;

        const playContextAudio = async () => {
            // Stop previous audio
            if (activeHowlRef.current) {
                activeHowlRef.current.stop();
                activeHowlRef.current = null;
            }

            // Reset sentence visual
            setActiveSentence(null);

            // 0. Explicit Audio Path (from Generated Deck)
            if (card.audioPath) {
                console.log(`[FlowDeck] Checking audioPath: ${card.audioPath}`);

                // Try EXACT match first with handle.name
                let res = resources.find(r => r.handle.name === card.audioPath);

                // If not found, try stripping extension from resource name
                if (!res) {
                    res = resources.find(r => {
                        const nameWithoutExt = r.handle.name.substring(0, r.handle.name.lastIndexOf('.'));
                        return nameWithoutExt === card.audioPath;
                    });
                }

                // Fallback to fuzzy includes
                if (!res) {
                    res = resources.find(r => r.handle.name.includes(card.audioPath!));
                }

                if (res) {
                    console.log(`[FlowDeck] Found resource: ${res.handle.name}`);
                    // Still try to find the context text for display!
                    const contextSentence = await db.sentences.where('audio').equals(card.audioPath).first();
                    if (contextSentence) setActiveSentence(contextSentence);

                    playResource(res.handle);
                    return;
                } else {
                    console.warn(`[FlowDeck] Resource NOT found for: ${card.audioPath}`);
                }
            }

            // 1. Context Matching
            // Strict match first
            const strictMatch = resources.find(r => r.type === 'audio' && r.handle.name.includes(card.word));


            if (strictMatch) {
                playResource(strictMatch.handle);
                return;
            }

            // Context Search
            const contextSentence = await db.sentences
                .filter(s => s.text.includes(card.word))
                .first();

            if (contextSentence) {
                console.log("Found context:", contextSentence.text);
                setActiveSentence(contextSentence);

                const audioRes = resources.find(r =>
                    r.type === 'audio' && r.handle.name.includes(contextSentence.audio)
                );

                if (audioRes) {
                    playResource(audioRes.handle);
                    return;
                }
            }
            // Fallback reading
            const readingMatch = resources.find(r => r.type === 'audio' && r.handle.name.includes(card.reading));
            if (readingMatch) {
                playResource(readingMatch.handle);
            }
        };

        playContextAudio();
    }, [activeIndex, cards, resources]);


    const playResource = async (handle: FileSystemFileHandle) => {
        try {
            // Double check cleanup
            if (activeHowlRef.current) activeHowlRef.current.stop();

            const file = await handle.getFile();
            const url = URL.createObjectURL(file);
            const sound = new Howl({
                src: [url],
                format: ['wav', 'mp3', 'ogg'],
                html5: true,
                onend: () => {
                    URL.revokeObjectURL(url);
                    activeHowlRef.current = null;
                },
                onstop: () => {
                    URL.revokeObjectURL(url);
                }
            });

            activeHowlRef.current = sound;
            sound.play();
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };




    // Scroll Logic to update Active Index
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const index = Math.round(container.scrollTop / container.clientHeight);

        if (index !== activeIndex && cards) {
            // If scanning forward (index > activeIndex), mark previous card as Good (4)
            if (index > activeIndex && cards[activeIndex]) {
                const prevCard = cards[activeIndex];

                console.log("Marking Good:", prevCard.word);
                // Fire and forget update
                if (prevCard.id) {
                    const updates = calculateNextReview(prevCard, 4); // Quality 4 = Good
                    db.cards.update(prevCard.id, updates);
                }
            }
            setActiveIndex(index);
        }
    };


    const handleReview = async (card: Card) => {
        // Left Swipe Logic (Review/Hard)
        console.log("Marking for review:", card.word);
        if (card.id) {
            const updates = calculateNextReview(card, 1); // Quality 1 = Hard
            await db.cards.update(card.id, updates);
        }
    };

    if (!initialized) return <div className="text-white text-center mt-20">Loading Zen Garden...</div>;
    if (!cards) return null;

    return (
        <div
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
            onScroll={handleScroll}
        >
            {cards.map((card, index) => (
                <FlowCard
                    key={card.id}
                    card={card}
                    sentence={index === activeIndex ? activeSentence : null}
                    onReview={handleReview}
                />
            ))}

            <div className="w-full h-[100dvh] snap-start flex items-center justify-center text-white/50">
                End of Deck
            </div>

            {/* Settings Toggle */}
            <button
                onClick={() => setShowSettings(true)}
                className="fixed top-6 right-6 z-50 p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors text-white/80"
            >
                <Settings size={24} />
            </button>

            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    );
};

