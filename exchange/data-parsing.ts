import {
	getLatestDirectory,
	findXmlFiles,
	parseXmlFile,
	getClassifierAndCatalog,
	cleanGroupName,
} from './exchange-helpers'
import {
	Items,
	GroupInfo,
	Offers,
	PriceInfo,
	Prices,
	Rests,
	WarehouseInfo,
	ParameterInfo,
} from './@types'

export async function dataParsing(basePath: string) {
	try {
		const latestDirectory = getLatestDirectory(basePath)
		const files = await findXmlFiles(latestDirectory)
		const offers = files.offersFile
			? await parseXmlFile(files.offersFile)
			: null
		const prices = files.pricesFile
			? await parseXmlFile(files.pricesFile)
			: null
		const rests = files.restsFile ? await parseXmlFile(files.restsFile) : null

		// Получение Классификатора и Каталога из import файлов
		const { classifier, items, properties } = await getClassifierAndCatalog(
			files.importFiles,
		)
		const parsedClassifierGroups = parseClassifierGroups(classifier)
		const parsedClassifierPrices = parseClassifierPrices(classifier)
		const parsedClassifierWarehouse = parseClassifierWarehouse(classifier)
		const parsedItems = parseItems(items)
		const parsedOffers = parseOffers(offers)
		const parsedPrices = parsePrices(prices)
		const parsedRests = parseRests(rests)
		const parsedProperties = parseProperties(properties)
		return {
			parsedClassifierGroups,
			parsedClassifierPrices,
			parsedClassifierWarehouse,
			parsedItems,
			parsedOffers,
			parsedPrices,
			parsedRests,
			parsedProperties,
		}
	} catch (error) {
		console.error('Ошибка обработки файлов:', error)
	}
}

function parseClassifierGroupsGroup(
	group: any,
	parentId: string | null = null,
): GroupInfo[] {
	const cleanedName = cleanGroupName(group.Наименование[0]) // использование cleanGroupName

	const result: GroupInfo[] = [
		{
			id: group.Ид[0],
			name: cleanedName,
			parentId: parentId || '',
		},
	]

	// Рекурсивно обрабатываем подгруппы, если они есть
	if (group.Группы) {
		for (const subgroup of group.Группы[0].Группа) {
			result.push(...parseClassifierGroupsGroup(subgroup, group.Ид[0]))
		}
	}

	return result
}

function parseClassifierGroups(classifier: any): GroupInfo[] {
	const parsedData: GroupInfo[] = []

	// Обработка всех главных групп в classifier
	for (const group of classifier.Группы[0].Группа) {
		parsedData.push(...parseClassifierGroupsGroup(group, null))
	}

	return parsedData
}

function parseClassifierPrices(classifier: any): PriceInfo[] {
	const parsedData: PriceInfo[] = []
	for (const price of classifier.ТипыЦен[0].ТипЦены) {
		parsedData.push({
			id: price.Ид[0],
			name:
				price.Наименование[0]
					.replace('Соглашение для сайта магазин', '')
					.trim() === 'Индустриальное шоссе'
					? 'Уфа'
					: price.Наименование[0]
							.replace('Соглашение для сайта магазин', '')
							.trim(),
		})
	}
	return parsedData
}

function parseClassifierWarehouse(classifier: any): WarehouseInfo[] {
	const parsedData: WarehouseInfo[] = []
	for (const warehouse of classifier.Склады[0].Склад) {
		const warehouseName = warehouse.Наименование[0]
		if (warehouseName.includes('БРАК')) {
			continue // Пропустить элементы, содержащие "БРАК"
		}
		parsedData.push({
			id: warehouse.Ид[0],
			name: warehouseName,
		})
	}
	return parsedData
}

function parseItems(items: any): Items[] {
	const parsedData: any[] = []
	for (const item of items.Товар) {
		parsedData.push({
			id: item.Ид[0],
			name: item.Наименование[0],
			vendorCode:
				item.ЗначенияРеквизитов[0].ЗначениеРеквизита.find(
					(entity: any) => entity.Наименование[0] === 'Код',
				)?.Значение[0] || '',
			groupID: item.Группы[0].Ид[0],
			manufacturer: item.Изготовитель
				? item.Изготовитель[0].Наименование[0]
				: '',
			weight: item.Вес[0],
			images: item.Картинка
				? Array.isArray(item.Картинка)
					? item.Картинка
					: [item.Картинка]
				: [],
			parameters: item.ЗначенияСвойств[0].ЗначенияСвойства.map(
				(parameter: any) => ({
					id: parameter.Ид[0],
					value: parameter.Значение[0],
				}),
			),
			description: item.Описание[0],
			brand: item.Изготовитель ? item.Изготовитель[0].Наименование[0] : '',
		})
	}
	return parsedData
}

function parseOffers(offers: any): Offers[] {
	const parsedData: any[] = []
	for (const offer of offers.КоммерческаяИнформация.ПакетПредложений[0]
		.Предложения[0].Предложение) {
		parsedData.push({
			id: offer.Ид[0],
			itemId: offer.Ид[0].split('#')[0],
			option: offer.ХарактеристикиТовара
				? offer.ХарактеристикиТовара[0].ХарактеристикаТовара.find(
						(item: any) => item.Наименование[0] === 'Наименование для выгрузки',
				  )?.Значение[0] || ''
				: '',
		})
	}
	return parsedData
}

function parsePrices(prices: any): Prices[] {
	const parsedData: Prices[] = []
	for (const price of prices.КоммерческаяИнформация.ПакетПредложений[0]
		.Предложения[0].Предложение) {
		parsedData.push({
			offerId: price.Ид[0],
			itemId: price.Ид[0].split('#')[0],
			values: price.Цены
				? price.Цены[0].Цена.map((item: any) => ({
						id: item.ИдТипаЦены[0],
						value: item.ЦенаЗаЕдиницу[0],
				  }))
				: [],
		})
	}
	return parsedData
}

function parseRests(rests: any): Rests[] {
	const parsedData: Rests[] = []
	for (const rest of rests.КоммерческаяИнформация.ПакетПредложений[0]
		.Предложения[0].Предложение) {
		parsedData.push({
			offerId: rest.Ид[0],
			warehouses: rest.Остатки
				? rest.Остатки[0].Остаток.flatMap((ostatok: any) =>
						ostatok.Склад.map((warehouse: any) => ({
							id: warehouse.Ид[0],
							value: parseFloat(warehouse.Количество[0]), // Преобразуем количество в число
						})),
				  )
				: [],
		})
	}
	return parsedData
}

function parseProperties(properties: any): ParameterInfo[] {
	const parsedData: ParameterInfo[] = []

	for (const property of properties.Свойство) {
		// Проверяем наличие вариантов значений

		const variants = property.ВариантыЗначений
			? property.ВариантыЗначений[0].Справочник
			: []

		parsedData.push({
			id: property.Ид,
			name: property.Наименование,
			values: variants.map((variant: any) => ({
				id: variant.ИдЗначения,
				value: variant.Значение,
			})),
		})
	}

	return parsedData
}
dataParsing('./uploads')
