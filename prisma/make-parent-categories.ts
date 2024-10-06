import { prisma } from './prisma-client'

import { constParentCategories } from './const-parent-categories'

export default async function makeParentCategories(categories: any[]) {
	const parentCategories = categories.filter(
		(category: any) => !category?.$?.parentId,
	)

	// Шаг 2: Добавляем родительские категории
	for (const parentCategory of parentCategories) {
		// Убираем префикс с числами и точкой
		const cleanName = parentCategory?._.replace(/^\d+\.\s*/, '')

		if (cleanName !== 'Misc') {
			await prisma.parentCategory.upsert({
				where: { id: parseInt(parentCategory?.$.id) },
				update: {
					name: cleanName,
				},
				create: {
					id: parseInt(parentCategory?.$.id),
					name: cleanName,
				},
			})
		}
	}
	console.log('Родительские категории добавлены.')

	for (const constCategory of constParentCategories) {
		await prisma.parentCategory.upsert({
			where: { name: constCategory.name },
			update: {
				icon: constCategory.icon,
				description: constCategory.description,
			},
			create: {
				name: constCategory.name,
				icon: constCategory.icon,
				description: constCategory.description,
			},
		})
	}
	console.log('Родительские категории обновлены.')
}
