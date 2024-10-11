import { prisma } from '@/prisma/prisma-client'

export interface GetSearchParams {
	query?: string
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
		distinct: ['vendorCode'],
		where: {
			...(categoryId_number && {
				categoryId: {
					in: [Number(categoryId_number)],
				},
			}),
			name: {
				contains: query_string,
				mode: 'insensitive',
			},
			...(price && {
				price: {
					gte: minPrice,
					lte: maxPrice,
				},
			}),
		},
	})
	return items
}
export const uniqueItems = async () => {
	const items = await prisma.item.findMany({
		distinct: ['vendorCode'],
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
