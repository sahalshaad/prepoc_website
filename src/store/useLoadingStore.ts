import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  hasLanded: boolean
  isSettled: boolean
  heroIntroPlayed: boolean
  setLoading: (val: boolean) => void
  setLanded: (val: boolean) => void
  setSettled: (val: boolean) => void
  setHeroIntroPlayed: (val: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: true,
  hasLanded: false,
  isSettled: false,
  heroIntroPlayed: false,
  setLoading: (val) => set({ isLoading: val }),
  setLanded: (val) => set({ hasLanded: val }),
  setSettled: (val) => set({ isSettled: val }),
  setHeroIntroPlayed: (val) => set({ heroIntroPlayed: val })
}))
