// cart-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartState, CartItem, responseData, OfferWithTypedJson } from './@types'

import { useCityStore } from './city-store'
import { Offer } from '@prisma/client'
import {
	clearCart,
	deleteCartItem,
	getCartItems,
	getCartItemsTotalPrice,
	patchCartItem,
	postCartItem,
} from '@/lib/cart'
import { toast } from 'sonner'
import apiClient from '@/lib/axios'
// Создание zustand store для корзины
export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			cartItems: [], // Товары в корзине
			cartLoading: false, // Состояние загрузки корзины
			totalAmount: 0, // Общее количество товаров
			totalPrice: 0, // Общая стоимость товаров

			// Инициализация корзины из базы данных
			syncCart: async () => {
				set({ cartLoading: true })
				try {
					const cartItems = await getCartItems()
					const { activeCity } = useCityStore.getState() // Получаем activeCity из zustand
					set({
						cartItems: cartItems,
						totalAmount: cartItems.reduce(
							(total: number, item: CartItem) => total + item.quantity,
							0,
						),
						totalPrice: await getCartItemsTotalPrice(cartItems, activeCity),
					})
				} catch (error) {
					console.error('Ошибка инициализации корзины:', error)
				} finally {
					set({ cartLoading: false })
				}
			},

			// Добавление товара в корзину
			addCartItem: async (offer: Offer) => {
				try {
					// Отправляем данные на сервер для сохранения
					const status = await postCartItem(offer)
					//Статус успешного добавления 201
					if (status === 201) {
						await get().syncCart()
						toast('Товар добавлен в корзину', {
							icon: '🛒',
							duration: 2000,
						})
					} else {
						toast('Ошибка добавления товара в корзину, попробуйте позже', {
							icon: '❗️',
							duration: 2000,
						})
						throw new Error(
							`STORE: Ошибка добавления товара в корзину: ${status.toString()}`,
						)
					}
				} catch (error) {
					console.error('STORE: Ошибка добавления товара:', error)
				}
			},

			// Удаление товара из корзины
			removeCartItem: async (offer: Offer) => {
				try {
					const status = await deleteCartItem(offer)
					// Статус успешного удаления 200
					if (status === 200) {
						await get().syncCart()
						toast('Товар удален из корзины', {
							icon: '🛒',
							duration: 2000,
						})
					} else {
						toast('Ошибка удаления товара из корзины, попробуйте позже', {
							icon: '❗️',
							duration: 2000,
						})
						throw new Error(
							`STORE: Ошибка удаления товара из корзины: ${status.toString()}`,
						)
					}
				} catch (error) {
					console.error('STORE: Ошибка удаления товара:', error)
				}
			},

			// Обновление количества товара
			updateCartItemQuantity: async (offer: Offer, quantity: number) => {
				try {
					const status = await patchCartItem(offer, quantity)
					// Статус успешного удаления 200
					if (status === 200) {
						await get().syncCart()
					} else {
						throw new Error(
							`STORE: Ошибка добавления товара в корзину: ${status.toString()}`,
						)
					}
				} catch (error) {
					console.error('STORE: Ошибка обновления количества:', error)
				}
			},

			// Очищение корзины
			emptyCart: async () => {
				try {
					const status = await clearCart()
					// Статус успешного удаления 200
					if (status === 200) {
						await get().syncCart()
						toast('Корзина очищена', {
							icon: '🛒',
							duration: 2000,
						})
					} else {
						throw new Error(
							`STORE: Ошибка очищения корзины: ${status.toString()}`,
						)
					}
				} catch (error) {
					console.error('STORE: Ошибка очищения корзины:', error)
				}
			},
		}),
		{
			name: 'cart-store', // Название хранилища
			storage: createJSONStorage(() => localStorage), // Используем localStorage для хранения данных
		},
	),
)
