'use server'
import { PrismaClient } from '@prisma/client'
import { constParentCategories } from './constants/const-parent-categories'

const prisma = new PrismaClient()
export default async function upConstants() {
	for (const constCategory of constParentCategories) {
		await prisma.parentCategory.update({
			where: { name: constCategory.name },
			data: {
				icon: constCategory.icon,
				description: constCategory.description,
			},
		})
	}
}
