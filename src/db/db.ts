import Dexie, { Table } from 'dexie';

export interface Deck {
    id?: number;
    name: string;
    coverImage?: string;
    sourceGalgame?: string; // Metadata about origin
    createdAt: number;
}

export interface Card {
    id?: number;
    deckId: number;
    word: string;      // 单词
    reading: string;   // 读音
    meaning: string;   // 释义
    pitch?: number[];  // Pitch accent data [0, 1, 0] etc.

    // Media Paths (Local File System or Blob URLs)
    audioPath?: string;
    imagePath?: string; // Context image

    // SRS Data
    easeFactor: number; // 2.5 default
    interval: number;   // Days
    dueDate: number;    // Timestamp
    reviewCount: number;

    status: 'new' | 'learning' | 'review' | 'mastered';
}

export class VocabDatabase extends Dexie {
    decks!: Table<Deck>;
    cards!: Table<Card>;
    resources!: Table<{
        id?: number;
        path: string;
        type: 'audio' | 'image';
        handle: FileSystemFileHandle; // Stored natively in IDB (Chrome only)
    }>;
    sentences!: Table<Sentence>;


    constructor() {
        super('VocabFlowDB');
        // Version 1: Initial
        this.version(1).stores({
            decks: '++id, name, sourceGalgame',
            cards: '++id, deckId, word, status, dueDate',
            resources: '++id, path, type'
        });

        // Version 2: Add Sentences
        this.version(2).stores({
            sentences: '++id, text, audio, source'
        });
    }

}

export const db = new VocabDatabase();

// Interface for Sentence
export interface Sentence {
    id?: number;
    text: string;
    audio: string;
    source: string;
}

