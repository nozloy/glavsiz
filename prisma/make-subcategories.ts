import { prisma } from './prisma-client'

export default async function makeSubcategories(categories: any[]) {
	// Получаем все категории и родительские категории из БД
	const existingCategories = await prisma.category.findMany()
	const parentCategories = await prisma.parentCategory.findMany()

	// Извлекаем их id для быстрого поиска
	const existingCategoryIds = existingCategories.map(category => category.id)
	const parentCategoryIds = parentCategories.map(
		parentCategory => parentCategory.id,
	)

	for (const category of categories) {
		if (
			category?.$.parentId &&
			!parentCategoryIds.includes(parseInt(category?.$.parentId)) &&
			existingCategoryIds.includes(parseInt(category?.$.parentId))
		) {
			const parentId = parseInt(category?.$.parentId)
			const subcategoryId = parseInt(category?.$.id)
			const cleanName = category?._.replace(/^\d+(\.\d+)*\s*/, '')
			console.log('Создаем подкатегорию: ', cleanName)
			await prisma.subcategory.upsert({
				where: { id: subcategoryId },
				update: {
					name: cleanName,
					categoryId: parentId, // Указываем, что это подкатегория, привязанная к parentId
				},
				create: {
					id: subcategoryId,
					name: cleanName,
					categoryId: parentId,
				},
			})
		}
	}
}
