import { create } from 'zustand';


interface AppState {
    currentDeckId: number | null;
    setCurrentDeckId: (id: number | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    // Settings
    theme: 'light' | 'dark'; // though we stick to dark mostly
    toggleTheme: () => void; // Existing

    // Anki Settings
    ankiConnectUrl: string;
    setAnkiConnectUrl: (url: string) => void;
    ankiDeckName: string | null;
    setAnkiDeckName: (name: string | null) => void;
    ankiModelName: string | null;
    setAnkiModelName: (name: string | null) => void;

}

export const useAppStore = create<AppState>((set) => ({
    currentDeckId: null,
    setCurrentDeckId: (id) => set({ currentDeckId: id }),
    isLoading: true,
    setIsLoading: (loading) => set({ isLoading: loading }),
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

    ankiConnectUrl: '/anki-api',
    setAnkiConnectUrl: (url) => set({ ankiConnectUrl: url }),
    ankiDeckName: 'Default',
    setAnkiDeckName: (name) => set({ ankiDeckName: name }),
    ankiModelName: 'Basic',
    setAnkiModelName: (name) => set({ ankiModelName: name }),
}));
