import { prisma } from './prisma-client'

export default async function makeCategories(categories: any[]) {
	const parentCategories = categories.filter(
		(category: any) => !category?.$?.parentId,
	)

	for (const category of categories) {
		const cleanName = category?._.replace(/^\d+(\.\d+)*\s*/, '')
		const parentId = parseInt(category?.$.parentId)
		if (
			parentId &&
			parentCategories.some(pc => pc?.$.id === parentId.toString())
		) {
			await prisma.category.upsert({
				where: { id: parseInt(category?.$.id) },
				update: {
					name: cleanName,
					parentCategoryId: parentId, // Указываем родительскую категорию
				},
				create: {
					id: parseInt(category?.$.id),
					name: cleanName,
					parentCategoryId: parentId, // Указываем родительскую категорию
				},
			})
		}
	}
	console.log('Категории добавлены.')
}
