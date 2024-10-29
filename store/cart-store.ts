import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
	addItemToCart,
	getCartItems,
	deleteCart,
	updateItemQuantity,
} from '../lib/cart'
import { Item } from '@prisma/client'

// Интерфейсы для состояния корзины и её элемента
export interface CartStateItem {
	itemId: number
	quantity: number
	name: string
	price: number
	variant?: string
}

export interface CartState {
	items: CartStateItem[]
	totalPrice: number
	totalAmount: number
	loading: boolean
	error: boolean
	fetchCartItems: (userId: number) => Promise<void>
	addCartItem: (userId: number, item: Item) => Promise<void>
	updateCartItemQuantity: (
		userId: number,
		itemId: number,
		quantity: number,
	) => Promise<void>
	emptyCart: (userId: number) => Promise<void>
}

// Вспомогательная функция для пересчета общей суммы и количества
const calculateTotals = (items: CartStateItem[]) => {
	const totalAmount = items.reduce((acc, item) => acc + item.quantity, 0)
	const totalPrice = items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	)
	return { totalAmount, totalPrice }
}

export const useCartStore = create(
	persist<CartState>(
		(set, get) => ({
			items: [],
			error: false,
			loading: false,
			totalPrice: 0,
			totalAmount: 0,

			// Функция для получения товаров из корзины пользователя
			fetchCartItems: async (userId: number) => {
				try {
					set({ loading: true, error: false })
					const data = await getCartItems(userId)
					const items = data.map(cartItem => ({
						itemId: cartItem.item.id,
						name: cartItem.item.name,
						price: cartItem.item.price || 0,
						quantity: cartItem.quantity,
						variant: cartItem.item.size || cartItem.item.color || ' ',
					}))
					const { totalAmount, totalPrice } = calculateTotals(items)
					set({ items, totalAmount, totalPrice })
				} catch (error) {
					console.error('Ошибка при загрузке товаров:', error)
					set({ error: true })
				} finally {
					set({ loading: false })
				}
			},

			// Функция для добавления товара в корзину
			addCartItem: async (userId: number, item: Item) => {
				try {
					set({ loading: true, error: false })
					await addItemToCart(userId, item.id)
					const existingItem = get().items.find(i => i.itemId === item.id)

					// Обновляем состояние в зависимости от наличия товара
					const updatedItems = existingItem
						? get().items.map(i =>
								i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i,
						  )
						: [
								...get().items,
								{
									itemId: item.id,
									name: item.name,
									price: item.price || 0,
									quantity: 1,
									variant: item.size || item.color || ' ',
								},
						  ]

					const { totalAmount, totalPrice } = calculateTotals(updatedItems)
					set({ items: updatedItems, totalAmount, totalPrice })
				} catch (error) {
					console.error('Ошибка при добавлении товара:', error)
					set({ error: true })
				} finally {
					set({ loading: false })
				}
			},

			// Функция для обновления количества товара
			updateCartItemQuantity: async (
				userId: number,
				itemId: number,
				quantity: number,
			) => {
				try {
					set({ loading: true, error: false })
					await updateItemQuantity(userId, itemId, quantity)

					const updatedItems = get().items.map(item =>
						item.itemId === itemId ? { ...item, quantity } : item,
					)
					const { totalAmount, totalPrice } = calculateTotals(updatedItems)
					set({ items: updatedItems, totalAmount, totalPrice })
				} catch (error) {
					console.error('Ошибка при обновлении количества:', error)
					set({ error: true })
				} finally {
					set({ loading: false })
				}
			},

			// Функция для очистки корзины
			emptyCart: async (userId: number) => {
				try {
					set({ loading: true, error: false })
					await deleteCart(userId)
					set({ items: [], totalAmount: 0, totalPrice: 0 })
				} catch (error) {
					console.error('Ошибка при очистке корзины:', error)
					set({ error: true })
				} finally {
					set({ loading: false })
				}
			},
		}),
		{
			name: 'cart-storage', // Название ключа в localStorage
		},
	),
)
