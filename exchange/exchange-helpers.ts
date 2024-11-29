'use server'
import fs from 'fs'
import path from 'path'
import { parseStringPromise, Builder } from 'xml2js'
import {
	Items,
	GroupInfo,
	Offers,
	PriceInfo,
	Prices,
	RelevantFiles,
	Rests,
	WarehouseInfo,
	ParameterInfo,
} from './@types'

// Функция для поиска последнего созданного подкаталога
export async function getLatestDirectory(basePath: string) {
	const directories = fs
		.readdirSync(basePath)
		.map(dir => path.join(basePath, dir))
		.filter(dir => fs.statSync(dir).isDirectory())

	if (directories.length === 0) {
		throw new Error('Нет подкаталогов в директории.')
	}

	const latestDir = directories.reduce(
		(latest, dir) => {
			const stats = fs.statSync(dir)
			return stats.mtime > latest.mtime ? { dir, mtime: stats.mtime } : latest
		},
		{ dir: directories[0], mtime: fs.statSync(directories[0]).mtime },
	)

	return latestDir.dir
}

// Функция для парсинга XML файла
export async function parseXmlFile(filePath: string) {
	if (!fs.existsSync(filePath)) {
		throw new Error(`Файл ${filePath} не найден`)
	}
	const content = fs.readFileSync(filePath, 'utf8')
	return await parseStringPromise(content)
}
// Функция для поиска XML файлов
export async function findXmlFiles(directory: string): Promise<RelevantFiles> {
	const files = fs.readdirSync(directory)
	const relevantFiles: RelevantFiles = {
		importFiles: [],
		offersFiles: [],
		pricesFile: null,
		restsFile: null,
	}

	for (const file of files) {
		const filePath = path.join(directory, file)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			continue
		} else {
			if (file.startsWith('import___')) {
				relevantFiles.importFiles.push(filePath)
			} else if (file.startsWith('offers___')) {
				relevantFiles.offersFiles.push(filePath)
			} else if (file.startsWith('prices___')) {
				relevantFiles.pricesFile = filePath
			} else if (file.startsWith('rests___')) {
				relevantFiles.restsFile = filePath
			}
		}
	}
	return relevantFiles
}
// Общая функция для записи в один XML файл
export async function saveToXmlFile(
	parsedClassifierGroups: GroupInfo[],
	parsedClassifierPrices: PriceInfo[],
	parsedClassifierWarehouses: WarehouseInfo[],
	parsedClassifierProperties: ParameterInfo[],
	parsedOffers: Offers[],
	parsedPrices: Prices[],
	parsedRests: Rests[],
	parsedItems: Items[],
	outputPath: string,
) {
	// Подготовка данных с обёрткой для групп и цен
	const data = {
		Groups: {
			Group: parsedClassifierGroups.map(group => ({
				id: group.id,
				name: group.name,
				parentId: group.parentId || '',
			})),
		},
		Prices: {
			Price: parsedClassifierPrices.map(price => ({
				id: price.id,
				name: price.name,
			})),
		},
		Warehouses: {
			Warehouse: parsedClassifierWarehouses.map(warehouse => ({
				id: warehouse.id,
				name: warehouse.name,
			})),
		},
		Properties: {
			Property: parsedClassifierProperties.map(property => ({
				id: property.id,
				name: property.name,
				values: property.values.map(value => ({
					id: value.id,
					value: value.value,
				})),
			})),
		},
		Items: {
			Item: parsedItems.map(good => ({
				id: good.id,
				name: good.name,
				vendorCode: good.vendorCode,
				groupID: good.groupID,
				images: {
					image: good.images,
				},
				parameters: { parameter: good.parameters },
				manufacturer: good.manufacturer,
				weight: good.weight,
			})),
		},
	}

	// Построение XML-структуры
	const builder = new Builder({ headless: true })
	const xmlContent = builder.buildObject(data)

	// Запись в файл
	if (xmlContent) {
		fs.writeFileSync(outputPath + '/base.xml', xmlContent, 'utf8')
		console.log(`Файл сохранен по пути: ${outputPath + '/base.xml'}`)
	} else {
		console.log('XML-структура пуста.')
	}
}
//Функция для получения нужного файла с offers
export async function getOffersFile(importFiles: string[]) {
	for (const filePath of importFiles) {
		const fileData = await parseXmlFile(filePath)
		const data =
			fileData.КоммерческаяИнформация.ПакетПредложений[0].Предложения[0]
				.Предложение
		if (data) {
			return fileData
		}
	}
}
// Функция для получения Классификатора и Каталога
export async function getClassifierAndCatalog(importFiles: string[]) {
	let classifier = null
	let items = null
	let properties = null
	for (const filePath of importFiles) {
		const fileData = await parseXmlFile(filePath)
		if (
			!classifier &&
			fileData.КоммерческаяИнформация.Классификатор &&
			fileData.КоммерческаяИнформация.Классификатор[0].Группы &&
			fileData.КоммерческаяИнформация.Классификатор[0].Склады
		) {
			classifier = fileData.КоммерческаяИнформация.Классификатор[0]
		}
		if (!items && fileData.КоммерческаяИнформация.Каталог[0].Товары) {
			items = fileData.КоммерческаяИнформация.Каталог[0].Товары[0]
		}
		if (
			!properties &&
			fileData.КоммерческаяИнформация.Классификатор &&
			fileData.КоммерческаяИнформация.Классификатор[0].Свойства &&
			fileData.КоммерческаяИнформация.Классификатор[0].Свойства[0].Свойство[0]
				.Ид[0] !== 'Бренд'
		) {
			properties = fileData.КоммерческаяИнформация.Классификатор[0].Свойства[0]
		}

		if (classifier && items && properties) break
	}
	if (!classifier) {
		throw new Error('Не удалось найти данные классификатора в import файлах')
	}
	if (!items) {
		throw new Error('Не удалось найти данные каталога в import файлах')
	}
	if (!properties) {
		throw new Error('Не удалось найти данные свойств в import файлах')
	}

	return { classifier, items, properties }
}

// Функция для очистки названий групп
export async function cleanGroupName(name: string): Promise<string> {
	return name.replace(/^[\d.]*\s*|\s*\.+\s*$/g, '').trim()
}
