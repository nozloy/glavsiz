import { prisma } from '@/prisma/prisma-client'

export interface GetSearchParams {
	query?: string
	sortBy?: string
	priceFrom?: string
	priceTo?: string
}

const DEFAULT_MIN_PRICE = 0
const DEFAULT_MAX_PRICE = 5000

export const findItems = async (params: GetSearchParams) => {
	const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE
	const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE

	return null
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
