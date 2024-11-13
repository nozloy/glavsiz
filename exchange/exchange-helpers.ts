import fs from 'fs'
import path from 'path'
import { parseStringPromise, Builder } from 'xml2js'
import {
	Goodies,
	GroupInfo,
	PriceInfo,
	RelevantFiles,
	WarehouseInfo,
} from './@types'

// Функция для поиска последнего созданного подкаталога
export function getLatestDirectory(basePath: string) {
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
		offersFile: null,
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
				relevantFiles.offersFile = filePath
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
export function saveToXmlFile(
	groups: GroupInfo[],
	prices: PriceInfo[],
	warehouses: WarehouseInfo[],
	parsedGoodies: Goodies[],
	outputPath: string,
) {
	// Подготовка данных с обёрткой для групп и цен
	const data = {
		Groups: {
			Group: groups.map(group => ({
				id: group.id,
				name: group.name,
				parentId: group.parentId || '',
			})),
		},
		Prices: {
			Price: prices.map(price => ({
				id: price.id,
				name: price.name,
			})),
		},
		Warehouses: {
			Warehouse: warehouses.map(warehouse => ({
				id: warehouse.id,
				name: warehouse.name,
			})),
		},
		Items: {
			Item: parsedGoodies.map(good => ({
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
	fs.writeFileSync(outputPath, xmlContent, 'utf8')
	console.log(`Файл сохранен по пути: ${outputPath}`)
}

// Функция для получения Классификатора и Каталога
export async function getClassifierAndCatalog(importFiles: string[]) {
	let classifier = null
	let goodies = null
	for (const filePath of importFiles) {
		const fileData = await parseXmlFile(filePath)
		if (!classifier && fileData.КоммерческаяИнформация.Классификатор[0]) {
			classifier = fileData.КоммерческаяИнформация.Классификатор[0]
		}
		if (!goodies && fileData.КоммерческаяИнформация.Каталог[0].Товары) {
			goodies = fileData.КоммерческаяИнформация.Каталог[0].Товары[0]
		}
		if (classifier && goodies) break
	}

	// Проверка на наличие Классификатора и Каталога
	if (!classifier || !goodies) {
		throw new Error(
			'Не удалось найти Классификатор или Каталог в import файлах',
		)
	}

	return { classifier, goodies }
}

// Функция для очистки названий групп
export function cleanGroupName(name: string): string {
	return name.replace(/^\d+(\.\d+)*\s*/, '')
}
