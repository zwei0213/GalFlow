import { db, Sentence } from '../db/db';


export async function importGalgameIndex() {
    try {
        const response = await fetch(`/galgame_index.json?t=${Date.now()}`);
        if (!response.ok) throw new Error("Index file not found");


        const data: Sentence[] = await response.json();
        console.log(`Loading ${data.length} sentences into DB...`);

        await db.transaction('rw', db.sentences, async () => {
            // Clear old?
            await db.sentences.clear();
            // Bulk add
            await db.sentences.bulkAdd(data);
        });

        console.log("Sentence Database Ready!");
        return data.length;
    } catch (e) {
        console.error("Failed to load Galgame Index", e);
        return 0;
    }
}
