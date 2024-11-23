'use server'
import cliProgress from 'cli-progress'
import { PrismaClient } from '@prisma/client'
import { Offers, PriceInfo, Prices, Rests, WarehouseInfo } from './@types'

const prisma = new PrismaClient()

export async function upOffers(
	offers: Offers[],
	rests: Rests[],
	prices: Prices[],
	warehouseClassifier: WarehouseInfo[],
	priceClassifier: PriceInfo[],
	batchSize = 500,
) {
	if (offers.length === 0) return

	// Прогресс-бар
	const progressBar = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic,
	)
	progressBar.start(offers.length, 0)

	// Ошибки
	const errors: { offerId: string; error: any }[] = []

	// Блочная обработка
	for (let i = 0; i < offers.length; i += batchSize) {
		const batch = offers.slice(i, i + batchSize)

		try {
			await Promise.all(
				batch.map(async offer => {
					const offerRests = rests
						.filter(rest => rest.offerId === offer.id)
						.flatMap(rest =>
							rest.warehouses.map(warehouse => {
								const warehouseInfo = warehouseClassifier.find(
									w => w.id === warehouse.id,
								)
								return warehouseInfo
									? { name: warehouseInfo.name, value: warehouse.value }
									: null
							}),
						)
						.filter(rest => rest !== null)

					const offerPrices = prices
						.filter(price => price.offerId === offer.id) // Фильтруем только нужные `price`
						.flatMap(price =>
							price.values.map(value => {
								const priceInfo = priceClassifier.find(p => p.id === value.id)
								return priceInfo
									? { name: priceInfo.name, value: value.value }
									: null
							}),
						)
						.filter(price => price !== null)

					try {
						await prisma.offer.upsert({
							where: { id: offer.id },
							update: {
								id: offer.id,
								itemId: offer.itemId,
								name: offer.option,
								warehouse: offerRests,
								price: offerPrices,
							},
							create: {
								id: offer.id,
								itemId: offer.itemId,
								name: offer.option,
								warehouse: offerRests,
								price: offerPrices,
							},
						})
					} catch (error) {
						// Добавляем запись об ошибке
						errors.push({ offerId: offer.id, error })
					}
				}),
			)

			// Обновление прогресса после обработки батча
			progressBar.update(Math.min(i + batchSize, offers.length))
		} catch (batchError) {
			console.error(
				`Ошибка в батче с ${i} по ${Math.min(i + batchSize, offers.length)}:`,
				batchError,
			)
		}
	}

	progressBar.stop()

	// Лог ошибок
	if (errors.length > 0) {
		console.error('Обнаружены ошибки в следующих записях:')
		errors.forEach(e => {
			console.error(`Запись с offerId: ${e.offerId}`, e.error)
		})
	}
}
