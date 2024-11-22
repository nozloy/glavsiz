// cart-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartState, CartItem } from './@types'

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],
			loading: false,

			// Инициализация корзины из базы данных
			initializeCart: async userId => {
				set({ loading: true })
				try {
					const response = await fetch(`/api/cart?userId=${userId}`)
					const data = await response.json()
					set({ items: data.items })
				} catch (error) {
					console.error('Ошибка инициализации корзины:', error)
				} finally {
					set({ loading: false })
				}
			},

			// Добавление товара в корзину
			addCartItem: async cartItem => {
				set(state => ({
					items: [...state.items, cartItem], // Добавляем товар в состояние
				}))

				try {
					// Отправляем данные на сервер для сохранения
					await fetch(`/api/cart`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(cartItem),
					})
				} catch (error) {
					console.error('Ошибка добавления товара:', error)
				}
			},

			// Удаление товара из корзины
			removeCartItem: async offerId => {
				set(state => ({
					items: state.items.filter(item => item.offerId !== offerId),
				}))
				try {
					await fetch(`/api/cart/${offerId}`, {
						method: 'DELETE',
					})
				} catch (error) {
					console.error('Ошибка удаления товара:', error)
				}
			},

			// Обновление количества товара
			updateCartItemQuantity: async (offerId, quantity) => {
				set(state => ({
					items: state.items.map(item =>
						item.offerId === offerId ? { ...item, quantity } : item,
					),
				}))
				try {
					await fetch(`/api/cart`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ offerId, quantity }),
					})
				} catch (error) {
					console.error('Ошибка обновления количества:', error)
				}
			},

			// Синхронизация корзины с сервером
			syncCart: async () => {
				try {
					const response = await fetch(`/api/cart/sync`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(get().items),
					})
					const data = await response.json()
					set({ items: data.items })
				} catch (error) {
					console.error('Ошибка синхронизации корзины:', error)
				}
			},
		}),
		{
			name: 'cart-store',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
