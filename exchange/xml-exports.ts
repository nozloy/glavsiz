'use server'
import path from 'path'
import { saveToXmlFile } from './exchange-helpers'
import {
	Items,
	GroupInfo,
	Offers,
	PriceInfo,
	Prices,
	Rests,
	WarehouseInfo,
	Param,
	ParameterInfo,
} from './@types'
export async function mainFeed(
	parsedClassifierGroups: GroupInfo[],
	parsedClassifierPrices: PriceInfo[],
	parsedClassifierWarehouse: WarehouseInfo[],
	parsedOffers: Offers[],
	parsedPrices: Prices[],
	parsedRests: Rests[],
	parsedItems: Items[],
	parsedProperties: ParameterInfo[],
	basePath: string,
) {
	// Сохранение в файл XML
	const outputPath = path.join(basePath, 'mainFeed.xml')
	saveToXmlFile(
		parsedClassifierGroups,
		parsedClassifierPrices,
		parsedClassifierWarehouse,
		parsedOffers,
		parsedPrices,
		parsedRests,
		parsedItems,
		parsedProperties,
		basePath,
	)
}
