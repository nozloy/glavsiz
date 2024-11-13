import path, { parse } from 'path'
import {
	getLatestDirectory,
	findXmlFiles,
	parseXmlFile,
	saveToXmlFile,
	getClassifierAndCatalog,
	cleanGroupName,
} from './exchange-helpers'
import {
	Goodies,
	GroupInfo,
	Offers,
	PriceInfo,
	Prices,
	Rests,
	WarehouseInfo,
} from './@types'

async function processFiles(basePath: string) {
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
		const { classifier, goodies } = await getClassifierAndCatalog(
			files.importFiles,
		)
		const parsedClassifierGroups = parseClassifierGroups(classifier)
		const parsedClassifierPrices = parseClassifierPrices(classifier)
		const parsedClassifierWarehouse = parseClassifierWarehouse(classifier)
		const parsedGoodies = parseGoodies(goodies)
		const parsedOffers = parseOffers(offers)
		const parsedPrices = parsePrices(prices)
		const parsedRests = parseRests(rests)

		// Сохранение в файл XML
		const outputPath = path.join(basePath, 'mainFeed.xml')
		saveToXmlFile(
			parsedClassifierGroups,
			parsedClassifierPrices,
			parsedClassifierWarehouse,
			parsedGoodies,
			outputPath,
		)
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
			name: price.Наименование[0],
		})
	}
	return parsedData
}

function parseClassifierWarehouse(classifier: any): WarehouseInfo[] {
	const parsedData: WarehouseInfo[] = []
	for (const warehouse of classifier.Склады[0].Склад) {
		parsedData.push({
			id: warehouse.Ид[0],
			name: warehouse.Наименование[0],
		})
	}
	return parsedData
}

function parseGoodies(goodies: any): Goodies[] {
	const parsedData: any[] = []
	for (const good of goodies.Товар) {
		parsedData.push({
			id: good.Ид[0],
			name: good.Наименование[0],
			vendorCode:
				good.ЗначенияРеквизитов[0].ЗначениеРеквизита.find(
					(item: any) => item.Наименование[0] === 'Код',
				)?.Значение[0] || '',
			groupID: good.Группы[0].Ид[0],
			manufacturer: good.Изготовитель
				? good.Изготовитель[0].Наименование[0]
				: '',
			weight: good.Вес[0],
			images: good.Картинка
				? Array.isArray(good.Картинка)
					? good.Картинка
					: [good.Картинка]
				: [],
			parameters: good.ЗначенияСвойств[0].ЗначенияСвойства.map(
				(parameter: any) => ({
					id: parameter.Ид[0],
					value: parameter.Значение[0],
				}),
			),
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
			goodId: offer.Ид[0].split('#')[0],
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
			goodId: price.Ид[0].split('#')[0],
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
			goodId: rest.Ид[0].split('#')[0],
			warehouses: rest.Остатки
				? rest.Остатки[0].Остаток[0].Склад.map((item: any) => ({
						id: item.Ид[0],
						value: item.Количество[0],
				  }))
				: [],
		})
	}
	return parsedData
}
processFiles('./uploads')
