import { db, Card, Deck } from './db';

const SEED_DECK: Deck = {
    name: 'JLPT N5 Core (Demo)',
    sourceGalgame: 'System',
    createdAt: Date.now()
};

const SEED_CARDS: Partial<Card>[] = [
    {
        word: '猫',
        reading: 'ねこ',
        meaning: 'Cat',
        pitch: [0, 1], // Low-High (Heiban)
        status: 'new',
        easeFactor: 2.5,
        interval: 0,
        reviewCount: 0,
        dueDate: Date.now()
    },
    {
        word: '世界',
        reading: 'せかい',
        meaning: 'World',
        pitch: [0, 1, 0], // Nakadaka? Actually Sekai is usually Atamadaka [1, 0, 0]
        status: 'new',
        easeFactor: 2.5,
        interval: 0,
        reviewCount: 0,
        dueDate: Date.now()
    },
    {
        word: '約束',
        reading: 'やくそく',
        meaning: 'Promise',
        pitch: [0, 1, 1, 1],
        status: 'new',
        easeFactor: 2.5,
        interval: 0,
        reviewCount: 0,
        dueDate: Date.now()
    }
];

export const seedDatabase = async () => {
    const count = await db.decks.count();
    if (count === 0) {
        const deckId = await db.decks.add(SEED_DECK);
        const cardsWithDeckId = SEED_CARDS.map(c => ({ ...c, deckId } as Card));
        await db.cards.bulkAdd(cardsWithDeckId);
        console.log('Database seeded!');
    }
};
