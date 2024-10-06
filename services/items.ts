import { Item } from '@prisma/client'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constants'

export const search = async (query: string): Promise<Item[]> => {
	return (
		await axiosInstance.get<Item[]>(ApiRoutes.SEARCH_PRODUCTS, {
			params: { query },
		})
	).data
}
