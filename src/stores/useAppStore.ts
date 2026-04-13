import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContextMode = 'fiap' | 'itau' | 'admin' ;

interface AppState {
  contextMode: ContextMode;
  sidebarCollapsed: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
  
  // Actions
  setContextMode: (mode: ContextMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setUser: (user: AppState['user']) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      contextMode: 'fiap',
      sidebarCollapsed: false,
      user: {
        name: 'Dr. Rafael Santos',
        email: 'rafael.santos@fiap.com.br',
        role: 'Professor FIAP & Gerente de IA Itaú',
        avatar: undefined,
      },
      
      setContextMode: (mode) => set({ contextMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'dualos-storage',
    }
  )
);
