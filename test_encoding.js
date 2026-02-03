import fs from 'fs';
import path from 'path';

const SCRIPT_PATH = 'D:/jj/script/0_kyo_01.ast';

try {
    const buffer = fs.readFileSync(SCRIPT_PATH);
    console.log("First 100 bytes hex:");
    console.log(buffer.subarray(0, 100).toString('hex'));

    console.log("\n--- Trying UTF-8 ---");
    console.log(buffer.toString('utf8').substring(0, 200));

    console.log("\n--- Trying Shift_JIS (via iconv) ---");
    // We can't verify iconv output easily in this console if the console defaults to utf8, 
    // but if the console output looks correct for UTF8, then it is UTF8.
} catch (e) {
    console.error(e);
}
