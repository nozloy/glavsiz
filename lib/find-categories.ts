'use server'
import apiClient from '@/lib/axios'
import { Category, ParentCategory } from '@prisma/client'

export const findParentCategories = async (): Promise<ParentCategory[]> => {
	try {
		const response = await apiClient.get(`/categories/parent/`)
		return response.data
	} catch (error) {
		console.error('Ошибка при запросе к API:', error)
		throw new Error('Ошибка при запросе к API')
	}
}

export const findCategories = async (): Promise<Category[]> => {
	try {
		const response = await apiClient.get(`/categories/basic/`)
		return response.data
	} catch (error) {
		console.error('Ошибка при запросе к API:', error)
		throw new Error('Ошибка при запросе к API')
	}
}
