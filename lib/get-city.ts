'use server'
import { prisma } from '@/prisma/prisma-client'
// import apiClient from '@/lib/axios'

export const getCity = async (choosenCity: string) => {
	const city = await prisma.city.findFirst({
		where: { name: choosenCity },
	})
	return city
}
