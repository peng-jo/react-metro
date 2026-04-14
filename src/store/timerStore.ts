import { create } from "zustand";

export type TimerState = {
  addSec: number;
  tick: () => void;
  reset: () => void;
  refreshInterval: 0 | 15 | 30 | 60;
  setRefreshInterval: (interval: 0 | 15 | 30 | 60) => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  addSec: 0,
  tick: () => set((state) => ({ addSec: state.addSec + 1 })),
  reset: () => set({ addSec: 0 }),
  refreshInterval: 0,
  setRefreshInterval: (interval: 0 | 15 | 30 | 60) =>
    set({ refreshInterval: interval }),
}));
