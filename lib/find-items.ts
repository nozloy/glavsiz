'use server'
import { prisma } from '@/prisma/prisma-client'
import apiClient from '@/lib/axios'
import {
	ItemWithOffer,
	ItemWithOfferOnly,
	OfferWithPrice,
	PriceFromDB,
} from '@/@types'
export interface GetSearchParams {
	query?: string
	count?: number
	categoryId?: string
	parentCategoryId?: string
	sortBy?: string
	priceFrom?: string
	priceTo?: string
	types?: string
}

//Получение данных по одному товару с offer
export const findItem = async (id: string): Promise<ItemWithOffer | null> => {
	try {
		// Отправляем запрос к API для получения товара
		const response = await apiClient.get(`/items/${id}`)

		// Если ответ успешный (200), возвращаем данные товара
		return response.data
	} catch (error: any) {
		// Логируем ошибку для диагностики
		console.error('Ошибка при запросе к API:', error)

		if (error.response) {
			// Логируем саму ошибку и статус
			console.error('API Error Response:', error.response)

			if (error.response.status === 404) {
				console.log(`Товар с id ${id} не найден`)
				return null // Возвращаем null, чтобы корректно обработать отсутствие товара
			}

			// Обработка других ошибок (например, 500)
			console.error('Ошибка API:', error.response?.data)
			throw new Error(`Ошибка API: ${error.response?.status}`)
		}

		// В случае других ошибок выбрасываем общее исключение
		throw new Error('Неизвестная ошибка при получении товара')
	}
}

export const getItemTypes = async () => {
	try {
		const response = await apiClient.get('/items/types')
		return response.data
	} catch (error) {
		console.error('Ошибка получения типов:', error)
		throw new Error('Ошибка получения типов')
	}
}

//получение новых товаров (с количеством count)
export const fetchNewItems = async (count: number) => {
	try {
		const response = await apiClient.get('/items/new?count=' + count.toString())
		return response.data
	} catch (error) {
		console.error('Ошибка получения новых товаров', error)
		throw new Error('Ошибка получения товаров')
	}
}

export const fetchBestItems = async (): Promise<ItemWithOffer[]> => {
	try {
		const response = await apiClient.get('/items/best')
		return response.data
	} catch (error) {
		console.error('Ошибка получения новых товаров', error)
		throw new Error('Ошибка получения товаров')
	}
}
//Получение товаров по фильтрам
export const filteredItems = async (
	params: GetSearchParams,
): Promise<ItemWithOffer[]> => {
	let query = params.query || ''
	let categoryId = params.categoryId || ''
	let count = params.count || 100
	let itemTypes = params.types || ''
	try {
		const response = await apiClient.get(
			`/items/search?${query ? 'query=' + query : '' + `&count=${count} `}${
				categoryId ? '&categoryId=' + categoryId : ''
			}${itemTypes ? '&types=' + itemTypes : ''}`,
		)
		return response.data
	} catch (error) {
		console.error('Ошибка получения новых товаров', error)
		throw new Error('Ошибка получения товаров')
	}
}

//Получение всех товаров c offer
export const allItems = async (): Promise<ItemWithOfferOnly[]> => {
	const items = await prisma.item.findMany({
		include: {
			Offer: true,
		},
	})
	return items.map(item => ({
		...item,
		Offer: item.Offer.map(offer => ({
			...offer,
			price: offer.price as PriceFromDB[], // Указываем явные типы
		})),
	}))
}
