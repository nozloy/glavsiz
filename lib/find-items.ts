'use server'
import { prisma } from '@/prisma/prisma-client'
import apiClient from '@/lib/axios'
import { ItemWithOffer } from '@/@types'
import { BestItem } from '@prisma/client'
export interface GetSearchParams {
	query?: string
	count?: number
	categoryId?: string
	sortBy?: string
	priceFrom?: string
	priceTo?: string
}

// const DEFAULT_MIN_PRICE = 0
// const DEFAULT_MAX_PRICE = 50000

// export const findItems = async (params: GetSearchParams) => {
// 	const query_string = params.query || ''
// 	const categoryId_number = params.categoryId || ''
// 	const price = params.priceFrom || params.priceTo
// 	const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE
// 	const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE

// 	// const items = await prisma.item.findMany({
// 	// 	distinct: ['id'],
// 	// })
// 	// return items
// }
//Получение данных по одному товару с offer
export const findItem = async (id: string) => {
	try {
		// Отправляем запрос к API для получения товара
		const response = await apiClient.get(`/items/${id}`)
		return response.data // Возвращаем данные товара
	} catch (error: any) {
		console.error('Ошибка получения товара:', error)
		throw new Error('Ошибка получения товара') // Кидаем ошибку, если не удалось получить товар
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
	let count = params.count || 50
	try {
		const response = await apiClient.get(
			`/items/search?${query ? 'query=' + query : '' + `&count=${count} `}${
				categoryId ? '&categoryId=' + categoryId : ''
			}`,
		)
		return response.data
	} catch (error) {
		console.error('Ошибка получения новых товаров', error)
		throw new Error('Ошибка получения товаров')
	}
}

// export const uniqueItems = async () => {
// 	const items = await prisma.item.findMany({
// 		distinct: ['id'],
// 	})
// 	return items
// }

//Получение всех товаров c offer
export const allItems = async () => {
	const items = await prisma.item.findMany({ include: { Offer: true } })
	return items
}
// export const allCategories = async () => {
// 	const categories = await prisma.category.findMany()

// 	return categories
// }
// export const allSubcategories = async () => {
// 	const subcategories = await prisma.subcategory.findMany()
// 	return subcategories
// }
