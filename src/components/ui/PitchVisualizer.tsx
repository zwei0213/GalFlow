import React from 'react';


// Pitch Accent visualizer
// pitch pattern: e.g. [0, 1, 1, 0] (Low, High, High, Low)
interface PitchVisualizerProps {
    text: string; // e.g. "約束" or "やくそく" (usually kana)
    pitch: number[]; // 0 for Low, 1 for High
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ text, pitch }) => {
    const chars = text.split('');

    if (chars.length !== pitch.length) {
        console.warn("Pitch length mismatch", text, pitch);
        return <div>{text}</div>;
    }

    return (
        <div className="relative inline-flex items-end h-20 pointer-events-none select-none">
            {/* SVG Path drawing with Neon Glow */}
            <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10" style={{ pointerEvents: 'none' }}>
                {/* Glow Layer */}
                <path
                    d={generatePitchPath(pitch)}
                    fill="none"
                    stroke="var(--color-torii-red)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40 blur-sm"
                />
                {/* Main Line */}
                <path
                    d={generatePitchPath(pitch)}
                    fill="none"
                    stroke="var(--color-torii-red)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-90"
                />

                {/* Dots at Nodes */}
                {pitch.map((level, i) => {
                    const charWidth = 40;
                    const halfChar = charWidth / 2;
                    const x = i * charWidth + halfChar;
                    const highY = 5;
                    const lowY = 25;
                    const y = level === 1 ? highY : lowY;
                    return (
                        <circle key={i} cx={x} cy={y} r="3" fill="white" className="drop-shadow-md" />
                    );
                })}
            </svg>

            {chars.map((char, i) => (
                <div key={i} className="flex flex-col items-center w-10">
                    <span className={`text-2xl font-jp font-medium ${pitch[i] ? 'text-white' : 'text-white/60'}`}>{char}</span>
                </div>
            ))}
        </div>
    );
};


// Helper: Generate SVG path for the line
// Assuming 40px width per char.
// Low y = 20, High y = 0 relative to "top" of kana? No, let's say Low is chart top 30%, High is chart top 5%.
function generatePitchPath(pitch: number[]) {
    const charWidth = 40;
    const halfChar = charWidth / 2;
    const highY = 5;
    const lowY = 25;

    let path = '';

    pitch.forEach((level, i) => {
        const x = i * charWidth + halfChar;
        const y = level === 1 ? highY : lowY;

        if (i === 0) {
            path += `M ${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }

        // Drop at the end if it's Odaka/Nakadaka followed by particle?
        // Usually particle is implied. Standard notation:
        // If [..., 1] (Heiban) -> Next particle is High.
        // If [..., 1, 0] -> Next particle Low.
        // For now simple line connecting centers.
    });

    return path;
}
