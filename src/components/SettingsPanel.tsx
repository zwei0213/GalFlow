import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, X, Database, Loader2 } from 'lucide-react';
import { fileSystem } from '../utils/fileSystem';
import { db } from '../db/db';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const [importing, setImporting] = useState(false);
    const [status, setStatus] = useState('');

    const handleImport = async () => {
        try {
            setImporting(true);
            setStatus('Selecting folder...');
            const dirHandle = await fileSystem.selectGameDirectory();

            setStatus(`Scanning ${dirHandle.name}...`);
            const resources = await fileSystem.scanDirectory(dirHandle);

            setStatus(`Found ${resources.length} files. Indexing...`);

            // Clear old resources? For now, just add new ones.
            // await db.resources.clear(); 

            await db.transaction('rw', db.resources, async () => {
                for (const res of resources) {
                    // Check if exists to avoid duplicates?
                    // Optimized bulkAdd is better but let's just loop for safety with handles
                    await db.resources.add({
                        path: res.path,
                        type: res.type,
                        handle: res.handle
                    });
                }
            });

            setStatus(`Successfully imported ${resources.length} resources!`);
            setTimeout(() => setStatus(''), 2000);
        } catch (error) {
            console.error(error);
            setStatus('Import failed / Cancelled');
        } finally {
            setImporting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={onClose} />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-kachimushiro border-l border-white/10 z-50 p-8 shadow-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-jp font-bold text-white">Settings</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="text-white" />
                            </button>
                        </div>

                        <div className="space-y-8 flex-1 overflow-y-auto">
                            {/* Resource Managment */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-sans font-bold text-sakura-pink flex items-center gap-2">
                                    <Database size={20} /> Resource Library
                                </h3>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <p className="text-sm text-gray-400">
                                        Import unpacked Galgame folders (containing <code className="bg-black/30 px-1 rounded">voice/</code>, <code className="bg-black/30 px-1 rounded">bg/</code>) to link with vocabulary.
                                    </p>

                                    <button
                                        onClick={handleImport}
                                        disabled={importing}
                                        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-bold flex items-center justify-center gap-2"
                                    >
                                        {importing ? <Loader2 className="animate-spin" /> : <FolderOpen />}
                                        {importing ? 'Scanning...' : 'Step 1: Select Game Folder'}
                                    </button>

                                    <button
                                        onClick={async () => {
                                            setStatus('Importing Script Index...');
                                            try {
                                                const { importGalgameIndex } = await import('../utils/importIndex');
                                                const count = await importGalgameIndex();
                                                setStatus(`Imported ${count} sentences.`);
                                            } catch (e) {
                                                setStatus('Import Failed');
                                            }
                                        }}
                                        className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-bold flex items-center justify-center gap-2"
                                    >
                                        <Database /> Step 2: Load Script Data
                                    </button>

                                    <button
                                        onClick={async () => {
                                            setStatus('Generating Deck...');
                                            try {
                                                const { generateDeckFromScript } = await import('../utils/generateDeck');
                                                const count = await generateDeckFromScript();
                                                setStatus(`Created ${count} cards from script!`);
                                            } catch (e) {
                                                console.error(e);
                                                setStatus('Generation Failed');
                                            }
                                        }}
                                        className="w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-95 transition-all text-white font-bold flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">🎴</span>
                                        <span>Step 3: Generate Deck from Voices</span>
                                    </button>



                                    {status && (
                                        <div className="text-xs font-mono text-center text-torii-red animate-pulse">
                                            {status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={async () => {
                                    if (confirm("This will WIPE all your progress and cards. Are you sure?")) {
                                        setStatus('Resetting Database...');
                                        await db.delete();
                                        window.location.reload();
                                    }
                                }}
                                className="w-full py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                            >
                                ⚠️ Reset / Wipe Database
                            </button>
                        </div>

                        <div className="text-center text-white/20 text-xs font-sans mt-8">
                            VocabFlow v0.1.0 • Neo-Tokyo Zen
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
