import { db, Card } from '../db/db';

export async function generateDeckFromScript() {
    // 1. Get all sentences (or sample)
    const count = await db.sentences.count();
    if (count === 0) {
        alert("Please load script data first (Step 2)");
        return 0;
    }

    // Get all sentences to filter in memory (might be heavy if 100k, but 20k is fine for modern browser)
    const sentences = await db.sentences.toArray();

    // 2. Filter for "Flashcard-able" sentences
    // Criteria: Short (Likely greetings, standard phrases, or simple statements)
    // Length: 2 < len < 10
    const candidates = sentences.filter(s => {
        const len = s.text.length;
        return len >= 2 && len <= 60; // Allow longer sentences now that UI is fixed
    });

    // 3. Select Random subset (e.g. 20 cards for the demo)
    const deckSize = 50;
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, deckSize);

    // 4. Create proper Cards
    const cards: Card[] = selected.map(s => ({
        deckId: 2, // New Deck ID
        word: s.text,
        reading: '', // We don't have reading generation yet
        meaning: 'Scene from Amakano 3',
        status: 'new',
        easeFactor: 2.5,
        interval: 0,
        dueDate: Date.now(),
        reviewCount: 0,
        // Audio path isn't a direct path, but FlowDeck uses 'word' lookup? 
        // No, FlowDeck now looks up 'context' by text match.
        // BUT, strictly, we should assume the card WORD IS the sentence text.
        // So the lookup will find itself.
        // We can also store the direct audio link to optimize.
        audioPath: s.audio // We can use this field to store the resource name
    }));

    // 5. Insert
    await db.transaction('rw', db.cards, async () => {
        // Clear existing cards to prevent duplicates/corruption
        await db.cards.clear();
        await db.cards.bulkAdd(cards);
    });

    console.log(`Generated ${cards.length} cards from script.`);
    return cards.length;
}
