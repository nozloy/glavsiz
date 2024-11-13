// @types/exchange/index.d.ts

// Тип для информации о группе товаров
export interface GroupInfo {
	id: string
	name: string
	parentId: string | null
}

// Тип для представления классификатора
export interface Classifier {
	groups: GroupInfo[]
	// Можно добавить другие поля, если они есть
}
interface RelevantFiles {
	importFiles: string[]
	offersFile: string | null
	pricesFile: string | null
	restsFile: string | null
}

interface PriceInfo {
	id: string
	name: String
}

type Price = {
	id: string
	value: string
}
interface Prices {
	offerId: string
	goodId: string
	values: Price[]
}

interface WarehouseInfo {
	id: string
	name: String
}

type Parameter = {
	id: string
	value: string
}
interface Goodies {
	id: string
	name: String
	vendorCode: String
	groupID: String
	manufacturer: String
	weight: String
	parameters: Parameter[]
	images: String[]
}

interface Offers {
	id: string
	option: string
	goodId: string
}

type quantites = {
	warehouseID: string
	quantity: string
}
interface Rests {
	offerId: string
	goodId: string
	warehouses: quantites[]
}
