'use server'
import { CategoryWithParent } from '@/@types'
import apiClient from '@/lib/axios'
import { Category, ParentCategory } from '@prisma/client'

export const findParentCategories = async (): Promise<ParentCategory[]> => {
	try {
		const response = await apiClient.get(`/categories/parent/`)
		return response.data
	} catch (error) {
		console.error('Ошибка получения родительской категории:', error)
		throw new Error('Ошибка при запросе к API')
	}
}

export const findCategories = async (): Promise<Category[]> => {
	try {
		const response = await apiClient.get(`/categories/basic/`)
		return response.data
	} catch (error) {
		console.error('Ошибка получения катгории:', error)
		throw new Error('Ошибка при запросе к API')
	}
}

export const getCategoryById = async (
	id: string,
): Promise<CategoryWithParent | ParentCategory> => {
	try {
		const response = await apiClient.get(`/categories/${id}`)
		return response.data
	} catch (error) {
		console.error('Ошибка получения категории по ID:', error)
		throw new Error('Ошибка при запросе к API')
	}
}
