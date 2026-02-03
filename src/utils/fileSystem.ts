


// Types for our resource map
export interface GameResource {
    name: string;
    path: string; // Relative path or ID
    handle: FileSystemFileHandle;
    type: 'audio' | 'image';
}

export const fileSystem = {
    // Open directory picker
    async selectGameDirectory(): Promise<FileSystemDirectoryHandle> {
        if ('showDirectoryPicker' in window) {
            return await (window as any).showDirectoryPicker({
                mode: 'read'
            });
        }
        throw new Error('File System Access API not supported');
    },

    // Recursively scan directory
    async scanDirectory(dirHandle: FileSystemDirectoryHandle, path = ''): Promise<GameResource[]> {
        const resources: GameResource[] = [];

        for await (const entry of (dirHandle as any).values()) {
            const relativePath = path ? `${path}/${entry.name}` : entry.name;

            if (entry.kind === 'file') {
                const name = entry.name.toLowerCase();
                if (name.endsWith('.wav') || name.endsWith('.mp3') || name.endsWith('.ogg')) {
                    resources.push({ name: entry.name, path: relativePath, handle: entry, type: 'audio' });
                } else if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.webp')) {
                    resources.push({ name: entry.name, path: relativePath, handle: entry, type: 'image' });
                }
            } else if (entry.kind === 'directory') {
                // Recursively scan subdirectories (e.g. 'voice', 'bg', 'ev')
                const subResources = await this.scanDirectory(entry, relativePath);
                resources.push(...subResources);
            }
        }
        return resources;
    },

    // Get file from handle
    async getFile(handle: FileSystemFileHandle): Promise<File> {
        return await handle.getFile();
    },

    // Create Object URL for preview (Don't forget to revoke!)
    async getUrl(handle: FileSystemFileHandle): Promise<string> {
        const file = await handle.getFile();
        return URL.createObjectURL(file);
    }
};
