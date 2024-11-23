'use server'
import { PrismaClient, Season } from '@prisma/client'
import { Items } from './@types'
import cliProgress from 'cli-progress'
import path from 'path'

const prisma = new PrismaClient()

export async function upItems(goods: Items[], batchSize = 100) {
	if (!goods || goods.length === 0) return

	console.log('Создание и обновление товаров...')

	// Получаем все категории для проверки наличия groupID
	const categories = await prisma.category.findMany({
		select: { id: true },
	})
	const categoryIds = new Set(categories.map(category => category.id))

	// Собираем все уникальные groupID из goods, отсутствующие в categoryIds
	const missingGroupIds = [
		...new Set(
			goods
				.map(good => good.groupID)
				.filter(groupId => !categoryIds.has(groupId)),
		),
	]

	// Запрашиваем соответствия для недостающих groupID
	const subcategoryMappings = await prisma.subcategory.findMany({
		where: { id: { in: missingGroupIds } },
		select: { id: true, categoryId: true },
	})

	// Создаем словарь для быстрого поиска по subcategory ID
	const subcategoryMap = new Map(
		subcategoryMappings.map(sub => [sub.id, sub.categoryId]),
	)

	// Прогресс-бар
	const progressBar = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic,
	)
	progressBar.start(goods.length, 0)

	// Ошибки
	const errors: { itemId: string; error: any }[] = []

	// Обработка товаров пакетами
	for (let i = 0; i < goods.length; i += batchSize) {
		const batch = goods.slice(i, i + batchSize)

		try {
			await Promise.all(
				batch.map(async good => {
					const validGroupId = categoryIds.has(good.groupID)
						? good.groupID
						: subcategoryMap.get(good.groupID)

					// Преобразуем строку изображений в массив имён файлов
					const imageArray = Array.isArray(good.images)
						? good.images.map(imagePath => path.basename(imagePath))
						: []

					const season = good.name.toLowerCase().includes('зим')
						? Season.Winter
						: good.name.toLowerCase().includes('лет')
						? Season.Summer
						: null

					try {
						await prisma.item.upsert({
							where: { id: good.id },
							update: {
								name: good.name,
								description: good.description,
								categoryId: validGroupId,
								vendorCode: good.vendorCode,
								brand: good.brand,
								images: imageArray,
								season: season,
							},
							create: {
								id: good.id,
								name: good.name,
								description: good.description,
								categoryId: validGroupId,
								vendorCode: good.vendorCode,
								brand: good.brand,
								images: imageArray,
								season: season,
							},
						})
					} catch (error) {
						errors.push({ itemId: good.id, error })
					}
				}),
			)

			// Обновление прогресса после обработки батча
			progressBar.update(Math.min(i + batchSize, goods.length))
		} catch (batchError) {
			console.error(
				`Ошибка в батче с ${i} по ${Math.min(i + batchSize, goods.length)}:`,
				batchError,
			)
		}
	}

	progressBar.stop()

	// Лог ошибок
	if (errors.length > 0) {
		console.error('Обнаружены ошибки в следующих записях:')
		errors.forEach(e => {
			console.error(`Товар с id: ${e.itemId}`, e.error)
		})
	}
}
