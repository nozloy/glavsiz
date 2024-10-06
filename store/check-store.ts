// check-store.ts
import { create } from 'zustand'

interface Store {
	viewMode: string
	setViewMode: (mode: string) => void
}

export const useStore = create<Store>(set => ({
	viewMode: 'cards', // начальное состояние
	setViewMode: mode => set({ viewMode: mode }), // действие для изменения состояния
}))
