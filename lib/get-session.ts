import { getServerSession } from 'next-auth'
import { authOptions } from '../constants/auth'
import { prisma } from '@/prisma/prisma-client'

export const getUserSession = async () => {
	const session = await getServerSession(authOptions)

	return session?.user ?? null
}

export const getRoleOrUnauthorized = async () => {
	const session = await getServerSession(authOptions)
	if (!session?.user?.id) {
		return null
	}
	const user = await prisma.user.findFirst({
		where: { id: Number(session?.user.id) },
	})

	if (!user) {
		return null
	}
	return user.role
}
