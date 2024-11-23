'use server'
import { Items, GroupInfo } from './@types'
import { PrismaClient } from '@prisma/client'
import cliProgress from 'cli-progress'

const prisma = new PrismaClient()

export async function upCategories(
	parsedClassifierGroups: GroupInfo[],
	parsedItems: Items[],
	batchSize = 10,
) {
	if (!parsedClassifierGroups || !parsedItems) return

	console.log('Создание и обновление категорий...')

	// Собираем валидные id групп из товаров
	const groupIds = new Set(parsedItems.map((item: Items) => item.groupID))

	// Родительские категории
	const parentCategories = parsedClassifierGroups.filter(
		category => !category.parentId,
	)
	const parentCategoryIds = new Set(
		parentCategories.map((cat: GroupInfo) => cat.id),
	)

	// Категории
	const categories = parsedClassifierGroups.filter(
		category => category.parentId && parentCategoryIds.has(category.parentId),
	)
	const categoryMap = new Map(categories.map(cat => [cat.id, cat]))

	// Подкатегории
	const subcategories = parsedClassifierGroups.filter(
		(category: GroupInfo) =>
			category.parentId && !parentCategoryIds.has(category.parentId),
	)

	// Прогресс-бары
	const parentProgress = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic,
	)
	const categoryProgress = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic,
	)
	const subcategoryProgress = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic,
	)

	// Лог ошибок
	const errors: { type: string; id: string; name: string; error: any }[] = []

	// Загрузка родительских категорий
	parentProgress.start(parentCategories.length, 0)
	for (let i = 0; i < parentCategories.length; i += batchSize) {
		const batch = parentCategories.slice(i, i + batchSize)
		try {
			await Promise.all(
				batch.map(async pCategory => {
					await prisma.parentCategory.upsert({
						where: { id: pCategory.id },
						update: { name: pCategory.name },
						create: { id: pCategory.id, name: pCategory.name },
					})
				}),
			)
			parentProgress.update(Math.min(i + batchSize, parentCategories.length))
		} catch (error) {
			batch.forEach(pCategory =>
				errors.push({
					type: 'ParentCategory',
					id: pCategory.id,
					name: pCategory.name,
					error,
				}),
			)
		}
	}
	parentProgress.stop()

	// Загрузка категорий
	categoryProgress.start(categories.length, 0)
	for (let i = 0; i < categories.length; i += batchSize) {
		const batch = categories.slice(i, i + batchSize)
		try {
			await Promise.all(
				batch.map(async category => {
					await prisma.category.upsert({
						where: { id: category.id },
						update: {
							name: category.name,
							parentCategoryId: category.parentId!,
						},
						create: {
							id: category.id,
							name: category.name,
							parentCategoryId: category.parentId!,
						},
					})
				}),
			)
			categoryProgress.update(Math.min(i + batchSize, categories.length))
		} catch (error) {
			batch.forEach(category =>
				errors.push({
					type: 'Category',
					id: category.id,
					name: category.name,
					error,
				}),
			)
		}
	}
	categoryProgress.stop()

	// Рекурсивная функция для поиска валидного parentId
	async function findValidParentId(
		subcategory: GroupInfo,
		categoryMap: Map<string, any>,
	): Promise<string | null> {
		let currentParentId = subcategory.parentId
		while (currentParentId && !categoryMap.has(currentParentId)) {
			const parentSubcategory = subcategories.find(
				sub => sub.id === currentParentId,
			)
			currentParentId = parentSubcategory ? parentSubcategory.parentId : null
		}
		return currentParentId
	}

	// Загрузка подкатегорий
	subcategoryProgress.start(subcategories.length, 0)
	for (let i = 0; i < subcategories.length; i += batchSize) {
		const batch = subcategories.slice(i, i + batchSize)
		try {
			await Promise.all(
				batch.map(async sCategory => {
					const validParentId = await findValidParentId(sCategory, categoryMap)
					if (validParentId) {
						await prisma.subcategory.upsert({
							where: { id: sCategory.id },
							update: { name: sCategory.name, categoryId: validParentId },
							create: {
								id: sCategory.id,
								name: sCategory.name,
								categoryId: validParentId,
							},
						})
					} else {
						throw new Error(`Invalid parentId for subcategory: ${sCategory.id}`)
					}
				}),
			)
			subcategoryProgress.update(Math.min(i + batchSize, subcategories.length))
		} catch (error) {
			batch.forEach(sCategory =>
				errors.push({
					type: 'Subcategory',
					id: sCategory.id,
					name: sCategory.name,
					error,
				}),
			)
		}
	}
	subcategoryProgress.stop()

	// Лог ошибок
	if (errors.length > 0) {
		console.error('Обнаружены ошибки:')
		errors.forEach(e =>
			console.error(`${e.type} [id: ${e.id}, name: ${e.name}]`, e.error),
		)
	}
}
