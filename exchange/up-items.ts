'use server'
import { PrismaClient, Season } from '@prisma/client'
import { Items, ParameterInfo } from './@types'
import cliProgress from 'cli-progress'
import path from 'path'

const prisma = new PrismaClient()

export async function upItems(
	items: Items[],
	propertiesClassifier: ParameterInfo[],
	batchSize = 100,
) {
	if (!items || items.length === 0) return

	console.log('Создание и обновление товаров...')

	// Получаем все категории для проверки наличия groupID
	const categories = await prisma.category.findMany({
		select: { id: true },
	})
	const categoryIds = new Set(categories.map(category => category.id))

	// Собираем все уникальные groupID из items, отсутствующие в categoryIds
	const missingGroupIds = [
		...new Set(
			items
				.map(item => item.groupID)
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
	progressBar.start(items.length, 0)

	// Ошибки
	const errors: { itemId: string; error: any }[] = []

	// Обработка товаров пакетами
	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize)

		try {
			await Promise.all(
				batch.map(async item => {
					const validGroupId = categoryIds.has(item.groupID)
						? item.groupID
						: subcategoryMap.get(item.groupID)

					// Преобразуем строку изображений в массив имён файлов
					const imageArray = Array.isArray(item.images)
						? item.images.map(imagePath => path.basename(imagePath))
						: []

					const season = item.name.toLowerCase().includes('зим')
						? Season.Winter
						: item.name.toLowerCase().includes('лет')
						? Season.Summer
						: null

					const itemType = item.parameters
						.map(parameter => {
							// Найти свойство с id, соответствующему id Вид изделия
							const matchingProperty = propertiesClassifier.find(
								property =>
									property.id[0] === '71f28efc-254e-11ee-8129-00d8619a33d0',
							)
							// Найти соответствующее значение материала по ID
							if (matchingProperty && parameter.id === matchingProperty.id[0]) {
								return matchingProperty.values.find(
									value => value.id[0] === parameter.value,
								)?.value[0]
							}
							return null
						})
						.find(Boolean) // Возвращаем первый непустой результат

					const material = item.parameters
						.filter(
							parameter =>
								parameter.value !== '00000000-0000-0000-0000-000000000000',
						) // Исключаем пустые значения
						.map(parameter => {
							// Находим все свойства, название которых содержит "материал"
							const matchingProperties = propertiesClassifier.filter(
								property =>
									property.name[0]?.toLowerCase().includes('материал'), // Проверяем наличие name и корректно сравниваем
							)

							// Перебираем все найденные свойства
							for (const matchingProperty of matchingProperties) {
								// Если найдено соответствие по id
								if (parameter.id === matchingProperty.id[0]) {
									// Ищем соответствующее значение по id параметра
									const matchedValue = matchingProperty.values.find(
										value => value.id[0] === parameter.value,
									)?.value[0] // Проверяем первое значение в массиве

									// Если значение найдено, возвращаем его
									if (matchedValue) {
										return matchedValue
									}
								}
							}

							return null // Возвращаем null, если ничего не найдено
						})
						.find(Boolean) // Возвращаем первое непустое значение

					const materialLiner = item.parameters
						.filter(
							parameter =>
								parameter.value !== '00000000-0000-0000-0000-000000000000',
						) // Исключаем пустые значения
						.map(parameter => {
							// Находим все свойства, название которых содержит "подклад"
							const matchingProperties = propertiesClassifier.filter(
								property => property.name[0]?.toLowerCase().includes('подклад'), // Проверяем наличие name и корректно сравниваем
							)

							// Перебираем все найденные свойства
							for (const matchingProperty of matchingProperties) {
								// Если найдено соответствие по id
								if (parameter.id === matchingProperty.id[0]) {
									// Ищем соответствующее значение по id параметра
									const matchedValue = matchingProperty.values.find(
										value => value.id[0] === parameter.value,
									)?.value[0] // Проверяем первое значение в массиве

									// Если значение найдено, возвращаем его
									if (matchedValue) {
										return matchedValue
									}
								}
							}

							return null // Возвращаем null, если ничего не найдено
						})
						.find(Boolean) // Возвращаем первое непустое значение

					const materialInsulation = item.parameters
						.filter(
							parameter =>
								parameter.value !== '00000000-0000-0000-0000-000000000000',
						) // Исключаем пустые значения
						.map(parameter => {
							// Находим все свойства с названием, содержащим "утепл"
							const matchingProperties = propertiesClassifier.filter(property =>
								property.name[0]?.toLowerCase().includes('утепл'),
							)

							// Ищем соответствие по ID параметра
							for (const property of matchingProperties) {
								if (property.id[0] === parameter.id) {
									// Ищем значение, соответствующее ID значения параметра
									const matchedValue = property.values.find(
										value => value.id[0] === parameter.value,
									)?.value[0]

									if (matchedValue) {
										return matchedValue // Возвращаем найденное значение
									}
								}
							}

							return null // Если ничего не найдено
						})
						.find(Boolean) // Возвращаем первое найденное значение

					const color = item.parameters
						.filter(
							parameter =>
								parameter.value !== '00000000-0000-0000-0000-000000000000',
						) // Исключаем пустые значения
						.map(parameter => {
							// Находим все свойства, название которых содержит "цвет"
							const matchingProperties = propertiesClassifier.filter(
								property => property.name[0]?.toLowerCase().includes('цвет'), // Проверяем наличие name и корректно сравниваем
							)

							// Перебираем все найденные свойства
							for (const matchingProperty of matchingProperties) {
								// Если найдено соответствие по id
								if (parameter.id === matchingProperty.id[0]) {
									// Ищем соответствующее значение по id параметра
									const matchedValue = matchingProperty.values.find(
										value => value.id[0] === parameter.value,
									)?.value[0] // Проверяем первое значение в массиве

									// Если значение найдено, возвращаем его
									if (matchedValue) {
										return matchedValue
									}
								}
							}

							return null // Возвращаем null, если ничего не найдено
						})
						.find(Boolean) // Возвращаем первое непустое значение

					const composition = item.parameters
						.map(parameter => {
							// Найти свойство с названием, содержащим "комплект"
							const matchingProperty = propertiesClassifier.find(property =>
								property.name[0].toLowerCase().includes('комплект'),
							)
							// Найти соответствующее значение материала по ID
							if (matchingProperty && parameter.id === matchingProperty.id[0]) {
								return matchingProperty.values.find(
									value => value.id[0] === parameter.value,
								)?.value[0]
							}
							return null
						})
						.find(Boolean) // Возвращаем первый непустой результат

					const heights = item.parameters
						.map(parameter => {
							// Найти свойство с id, соответствующему id размеру
							const matchingProperty = propertiesClassifier.find(
								property =>
									property.id[0] === '777c553f-910f-11ef-aa21-9418826e94b3',
							)
							// Найти соответствующее значение материала по ID
							if (matchingProperty && parameter.id === matchingProperty.id[0]) {
								return matchingProperty.values.find(
									value => value.id[0] === parameter.value,
								)?.value[0]
							}
							return null
						})
						.find(Boolean) // Возвращаем первый непустой результат

					const sole = item.parameters
						.map(parameter => {
							// Найти свойство с названием, содержащим "подошв"
							const matchingProperty = propertiesClassifier.find(property =>
								property.name[0].toLowerCase().includes('подошв'),
							)
							// Найти соответствующее значение материала по ID
							if (matchingProperty && parameter.id === matchingProperty.id[0]) {
								return matchingProperty.values.find(
									value => value.id[0] === parameter.value,
								)?.value[0]
							}
							return null
						})
						.find(Boolean) // Возвращаем первый непустой результат

					try {
						await prisma.item.upsert({
							where: { id: item.id },
							update: {
								name: item.name,
								description: item.description,
								categoryId: validGroupId,
								vendorCode: item.vendorCode,
								brand: item.brand,
								images: imageArray,
								season: season,
								materials: material || null,
								materialLiner: materialLiner || null,
								materialInsulation: materialInsulation || null,
								color: color || null,
								composition: composition || null,
								heights: heights || null,
								sole: sole || null,
								itemType: itemType || null,
							},
							create: {
								id: item.id,
								name: item.name,
								description: item.description,
								categoryId: validGroupId,
								vendorCode: item.vendorCode,
								brand: item.brand,
								images: imageArray,
								season: season,
								materials: material || null,
								materialLiner: materialLiner || null,
								materialInsulation: materialInsulation || null,
								color: color || null,
								composition: composition || null,
								heights: heights || null,
								sole: sole || null,
								itemType: itemType || null,
							},
						})
					} catch (error) {
						errors.push({ itemId: item.id, error })
					}
				}),
			)

			// Обновление прогресса после обработки батча
			progressBar.update(Math.min(i + batchSize, items.length))
		} catch (batchError) {
			console.error(
				`Ошибка в батче с ${i} по ${Math.min(i + batchSize, items.length)}:`,
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
