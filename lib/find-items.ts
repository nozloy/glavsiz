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
	types?: string
}

//Получение данных по одному товару с offer
export const findItem = async (id: string): Promise<ItemWithOffer> => {
	try {
		// Отправляем запрос к API для получения товара
		const response = await apiClient.get(`/items/${id}`)
		return response.data // Возвращаем данные товара
	} catch (error: any) {
		console.error('Ошибка получения товара:', error)
		throw new Error('Ошибка получения товара') // Кидаем ошибку, если не удалось получить товар
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
	let count = params.count || 50
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
export const allItems = async () => {
	const items = await prisma.item.findMany({ include: { Offer: true } })
	return items
}
