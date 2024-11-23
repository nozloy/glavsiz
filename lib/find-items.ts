'use server'
import { prisma } from '@/prisma/prisma-client'
import apiClient from '@/lib/axios'

export interface GetSearchParams {
	query?: string
	count?: number
	categoryId?: string
	sortBy?: string
	priceFrom?: string
	priceTo?: string
}

const DEFAULT_MIN_PRICE = 0
const DEFAULT_MAX_PRICE = 5000

export const findItems = async (params: GetSearchParams) => {
	const query_string = params.query || ''
	const categoryId_number = params.categoryId || ''
	const price = params.priceFrom || params.priceTo
	console.log(query_string, categoryId_number)
	const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE
	const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE

	const items = await prisma.item.findMany({
		distinct: ['id'],
	})
	return items
}

//получение новых товаров (с количеством)
export async function fetchNewItems(count: number) {
	try {
		const response = await apiClient.get('/items/new?count=' + count.toString())
		return response.data
	} catch (error) {
		console.error('Ошибка получения новых товаров', error)
		throw new Error('Ошибка получения товаров')
	}
}

export async function filteredItems(params: GetSearchParams) {
	let query = params.query || ''
	let categoryId = params.categoryId || ''
	try {
		const response = await apiClient.get(
			`/items/search?${query ? 'query=' + query : ''}${
				categoryId ? '&categoryId=' + categoryId : ''
			}`,
		)
		return response.data
	} catch (error) {
		console.error('Ошибка получения новых товаров', error)
		throw new Error('Ошибка получения товаров')
	}
}

export const uniqueItems = async () => {
	const items = await prisma.item.findMany({
		distinct: ['id'],
	})
	return items
}
export const allItems = async () => {
	const items = await prisma.item.findMany()
	return items
}
export const allCategories = async () => {
	const categories = await prisma.category.findMany()

	return categories
}
export const allSubcategories = async () => {
	const subcategories = await prisma.subcategory.findMany()
	return subcategories
}
