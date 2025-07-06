import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChampionState {
  firstName: string;
  email: string;
  setChampionInfo: (firstName: string, email: string) => void;
  clearChampionInfo: () => void;
}

export const useChampionStore = create<ChampionState>()(
  persist(
    (set) => ({
      firstName: '',
      email: '',
      setChampionInfo: (firstName: string, email: string) => set({ firstName, email }),
      clearChampionInfo: () => set({ firstName: '', email: '' }),
    }),
    {
      name: 'champion-storage',
    }
  )
);