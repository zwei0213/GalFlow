
export const DEFAULT_ANKI_URL = '/anki-api';

export interface AnkiConnectResponse<T> {
    result: T;
    error: string | null;
}

export class AnkiConnect {
    url: string;

    constructor(url: string = DEFAULT_ANKI_URL) {
        this.url = url;
    }

    async invoke<T>(action: string, params: any = {}): Promise<T> {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                body: JSON.stringify({ action, version: 6, params }),
                headers: { 'Content-Type': 'application/json' } // AnkiConnect doesn't strictly need this but good practice
            });

            if (!response.ok) {
                throw new Error(`Example HTTP error: ${response.status}`);
            }

            const json = await response.json() as AnkiConnectResponse<T>;
            if (json.error) {
                throw new Error(json.error);
            }
            return json.result;
        } catch (e: any) {
            console.error(`AnkiConnect Error [${action}]:`, e);
            throw e;
        }
    }

    async requestPermission(): Promise<string> {
        return this.invoke<string>('requestPermission');
    }

    async getDeckNames(): Promise<string[]> {
        return this.invoke<string[]>('deckNames');
    }

    async getModelNames(): Promise<string[]> {
        return this.invoke<string[]>('modelNames');
    }

    async getModelFieldNames(modelName: string): Promise<string[]> {
        return this.invoke<string[]>('modelFieldNames', { modelName });
    }

    async addNote(
        deckName: string,
        modelName: string,
        fields: Record<string, string>,
        audio?: {
            filename: string;
            data: string; // base64
            fields: string[]; // fields to play audio on
        }[]
    ): Promise<number> { // returns note ID
        const params: any = {
            note: {
                deckName,
                modelName,
                fields,
                options: {
                    allowDuplicate: false,
                    duplicateScope: 'deck'
                }
            }
        };

        if (audio && audio.length > 0) {
            params.note.audio = audio;
        }

        return this.invoke<number>('addNote', params);
    }

    // Helper to store media file
    async storeMediaFile(filename: string, data: string): Promise<string> {
        return this.invoke<string>('storeMediaFile', { filename, data });
    }
}

export const ankiConnect = new AnkiConnect();
