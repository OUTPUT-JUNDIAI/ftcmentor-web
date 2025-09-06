import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Metrics } from '@/types';
import { DEFAULT_MATCHING_WEIGHTS } from '@/lib/constants';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  locale: 'pt-BR' | 'en-US';
  sidebarCollapsed: boolean;
  matchingWeights: typeof DEFAULT_MATCHING_WEIGHTS;
  metrics: Metrics | null;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLocale: (locale: 'pt-BR' | 'en-US') => void;
  toggleSidebar: () => void;
  updateMatchingWeights: (weights: Partial<typeof DEFAULT_MATCHING_WEIGHTS>) => void;
  setMetrics: (metrics: Metrics) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      locale: 'pt-BR',
      sidebarCollapsed: false,
      matchingWeights: DEFAULT_MATCHING_WEIGHTS,
      metrics: null,

      setTheme: (theme) => set({ theme }),
      
      setLocale: (locale) => set({ locale }),
      
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      
      updateMatchingWeights: (weights) => {
        set({
          matchingWeights: { ...get().matchingWeights, ...weights },
        });
      },
      
      setMetrics: (metrics) => set({ metrics }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        sidebarCollapsed: state.sidebarCollapsed,
        matchingWeights: state.matchingWeights,
      }),
    }
  )
);