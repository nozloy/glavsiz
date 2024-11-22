import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CityState {
	activeCity: string
	setActiveCity: (city: string) => void
}

export const useCityStore = create<CityState>()(
	persist(
		set => ({
			activeCity: 'Уфа', // Значение по умолчанию
			setActiveCity: city => set({ activeCity: city }),
		}),
		{
			name: 'active-city', // Ключ для локального хранилища
			storage: createJSONStorage(() => localStorage),
		},
	),
)
