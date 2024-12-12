'use server'
import { prisma } from '@/prisma/prisma-client'
import apiClient from '@/lib/axios'
import { User } from '@prisma/client'

export const allUsers = async (role: string) => {
	let users: User[] = []
	if (role === 'moder') {
		users = await prisma.user.findMany({
			where: {
				role: 'USER',
			},
		})
	}
	if (role === 'admin') {
		users = await prisma.user.findMany({
			where: {
				OR: [{ role: 'USER' }, { role: 'MODER' }, { role: 'ADMIN' }],
			},
		})
	}
	return users
}
