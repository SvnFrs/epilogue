'use client';

/**
 * Zustand holds ONLY UI-ephemeral rail state — open/collapsed (research D3). The
 * space/status SELECTION is URL-driven (the route is the source of truth), never here.
 */
import { create } from 'zustand';

interface RailState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useRailStore = create<RailState>((set) => ({
  open: false, // mobile drawer closed by default
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
