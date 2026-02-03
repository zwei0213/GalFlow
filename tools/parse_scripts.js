import fs from 'fs';
import path from 'path';

const SCRIPT_DIR = 'D:/jj/script';
const OUTPUT_FILE = 'D:/jj/public/galgame_index.json';

const astFiles = fs.readdirSync(SCRIPT_DIR).filter(f => f.endsWith('.ast'));
console.log(`Found ${astFiles.length} script files.`);

const resources = [];

astFiles.forEach(file => {
    const filePath = path.join(SCRIPT_DIR, file);
    // Artemis AST in Amakano 3 is valid UTF-8
    const content = fs.readFileSync(filePath, 'utf8');

    // Split by blocks
    const blocks = content.split('block_');

    blocks.forEach(block => {
        // 1. Extract Audio
        // Format: {"vo",file="fem_jsa_30001",ch="jsa"}
        const voMatch = block.match(/\{"vo",file="([^"]+)"/);

        // 2. Extract Text
        // Strategy: Look for the text attribute or last standalone string
        let dialogue = '';

        // Priority 1: text="Value" inside a Lua table
        const textAttrMatch = block.match(/text="([^"]+)"/);
        if (textAttrMatch) {
            dialogue = textAttrMatch[1];
        } else {
            // Priority 2: Standalone string at end of block
            const lines = block.split('\n');
            for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i].trim();
                // Check if it's a "Dialogue" string
                // Starts with ", ends with " (maybe comma)
                // Does NOT contain = (assignment)
                if (line.match(/^"[^"]+"[,]?$/) && !line.includes('=')) {
                    const clean = line.replace(/^"|"[,]?$/g, '');
                    // Heuristic: Japanese text usually has multi-byte chars or known punctuation
                    if (clean.length > 0) {
                        dialogue = clean;
                        break;
                    }
                }
            }
        }

        // Validity Checks
        if (voMatch && dialogue) {
            const audioFile = voMatch[1];
            // Filter: Only index lines with actual Japanese content
            // Check for Kana/Kanji/Punctuation
            if (dialogue.length >= 1 && /[\u3000-\u30ff\u4e00-\u9faf\uff00-\uffef]/.test(dialogue)) {
                resources.push({
                    text: dialogue,
                    audio: audioFile,
                    source: file
                });
            }
        }
    });
});

console.log(`Extracted ${resources.length} voice lines.`);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resources, null, 2));
console.log(`Saved index to ${OUTPUT_FILE}`);
