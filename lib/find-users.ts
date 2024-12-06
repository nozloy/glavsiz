'use server'
import { prisma } from '@/prisma/prisma-client'
import apiClient from '@/lib/axios'

export const allUsers = async () => {
	const users = await prisma.user.findMany()
	return users
}
