import { PrismaClient } from '@prisma/client'
import { dataParsing } from './data-parsing'
import { upCategories } from './up-categories'
import { upItems } from './up-items'
import { upOffers } from './up-offers'
import upConstants from './up-constants'
const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

async function main() {
	try {
		await down()
		await up()
	} catch (e) {
		console.error('Ошибка:', e)
	} finally {
		await prisma.$disconnect()
	}
}

// Запуск основного процесса
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

async function down() {
	await prisma.$executeRaw`TRUNCATE TABLE "ParentCategory" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Subcategory" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Item" RESTART IDENTITY CASCADE`
	console.log('База данных очищена.')
}

export async function up() {
	console.log('Получаем данные из выгрузки...')
	const exchange = await dataParsing('./uploads').finally(() => {
		console.log('Данные получены.')
	})
	if (!exchange) {
		throw new Error('Данные не получены.')
	} else {
		await upCategories(
			await exchange.parsedClassifierGroups,
			exchange.parsedItems,
		)
		await upConstants()
		await upItems(exchange.parsedItems)
		await upOffers(
			exchange.parsedOffers,
			exchange.parsedRests,
			exchange.parsedPrices,
			exchange.parsedClassifierWarehouse,
			exchange.parsedClassifierPrices,
		)
	}
}
