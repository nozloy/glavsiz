import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function down() {}

async function main() {}

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
