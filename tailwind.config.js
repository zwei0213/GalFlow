/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Neo-Tokyo Zen Palette
                'kachimushiro': '#181b2c', // Deep Indigo Background
                'torii-red': '#e60033',     // Action / Alert
                'bamboo-green': '#76d275',  // Success
                'sakura-pink': '#ffb7c5',   // Progress / Soft Accent
                'ink-black': '#0f0f0f',     // Text
                'paper-white': '#f5f5f0',   // Paper like white
            },
            fontFamily: {
                'jp': ['"Noto Serif JP"', 'serif'],
                'sans': ['"Outfit"', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
