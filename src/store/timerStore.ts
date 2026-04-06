import { create } from "zustand";

export type TimerState = {
  addSec: number;
  tick: () => void;
  reset: () => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  addSec: 0,
  tick: () => set((state) => ({ addSec: state.addSec + 1 })),
  reset: () => set({ addSec: 0 }),
}));
