import { create } from 'zustand';


interface AppState {
    currentDeckId: number | null;
    setCurrentDeckId: (id: number | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    // Settings
    theme: 'light' | 'dark'; // though we stick to dark mostly
    toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentDeckId: null,
    setCurrentDeckId: (id) => set({ currentDeckId: id }),
    isLoading: true,
    setIsLoading: (loading) => set({ isLoading: loading }),
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
