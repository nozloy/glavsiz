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
	name: string
}
interface ParameterInfo {
	id: string
	name: string
	values: Param[]
}

type Param = {
	id: string
	value: string
}

type Price = {
	id: string
	value: string
}
interface Prices {
	offerId: string
	itemId: string
	values: Price[]
}

interface WarehouseInfo {
	id: string
	name: string
}

type Parameter = {
	id: string
	value: string
}
interface Items {
	id: string
	name: string
	vendorCode: string
	brand: string
	groupID: string
	manufacturer: string
	weight: string
	parameters: Parameter[]
	images: string[]
	description: string
}

interface Offers {
	id: string
	option: string
	itemId: string
}

type warehouse = {
	id: string
	value: string
}
interface Rests {
	offerId: string
	warehouses: warehouse[]
}
