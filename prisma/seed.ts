import { PrismaClient } from '@prisma/client'
import { constParentCategories } from './const-parent-categories'
import constants from './constants'
import fetchFeed from './fetch-feed'
import makeParentCategories from './make-parent-categories'
import makeCategories from './make-categories'
import makeSubcategories from './make-subcategories'

const prisma = new PrismaClient()

async function down() {
	await prisma.$executeRaw`TRUNCATE TABLE "ParentCategory" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Item" RESTART IDENTITY CASCADE`
	console.log('База данных очищена.')
}

async function upCategories(categories: any[]) {
	await makeParentCategories(categories)
	await makeCategories(categories)
	await makeSubcategories(categories)
}

async function upItems(items: any[]) {
	const existingSubcategories = await prisma.subcategory.findMany()
	const subcategoryMap = new Map(
		existingSubcategories.map(sub => [sub.id, sub.categoryId]),
	)

	for (const item of items) {
		const categoryId = parseInt(item.categoryId)
		let finalCategoryId = categoryId

		if (subcategoryMap.has(categoryId)) {
			finalCategoryId = subcategoryMap.get(categoryId)!
		}
		console.log('Создаем товар: ', item.name, ' ', item.vendorCode)
		await prisma.item.upsert({
			where: { id: Number(item.id) },
			update: {
				name: item.name,
				description: item.description,
				count: Number(item.count),
				vendorCode: item.vendorCode,
				images: item.images,
				size: item.size,
				price: item.price,
				season: item.season,
				materials: item.materials,
				categoryId: finalCategoryId,
				color: item.color,
				brand: item.brand,
				materialLiner: item.materialLiner,
				materialInsulation: item.materialInsulation,
			},
			create: {
				name: item.name,
				description: item.description,
				count: Number(item.count),
				vendorCode: item.vendorCode,
				size: item.size,
				images: item.images,
				price: item.price,
				season: item.season,
				materials: item.materials,
				categoryId: finalCategoryId,
				color: item.color,
				brand: item.brand,
				materialLiner: item.materialLiner,
				materialInsulation: item.materialInsulation,
			},
		})
	}
}

async function main() {
	try {
		await down() // Очистка базы данных

		const { items, categories } = (await fetchFeed())!

		if (categories) {
			await upCategories(categories)
		}
		if (items) {
			await upItems(items)
		}
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
