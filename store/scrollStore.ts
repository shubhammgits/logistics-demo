import { create } from 'zustand';

export type SceneType = 'hero' | 'stats' | null;

interface ScrollState {
  progress: number;
  setProgress: (progress: number) => void;
  activeScene: SceneType;
  setActiveScene: (scene: SceneType) => void;
  introState: "loading" | "gate" | "unlocked";
  setIntroState: (state: "loading" | "gate" | "unlocked") => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
  activeScene: 'hero',
  setActiveScene: (activeScene) => set({ activeScene }),
  introState: "loading",
  setIntroState: (introState) => set({ introState }),
}));
