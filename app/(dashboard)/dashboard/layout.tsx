import type { Metadata } from 'next'
import { getUserSession } from '@/lib/get-session'
import { prisma } from '@/prisma/prisma-client'
import { Role } from '@prisma/client'

export const metadata: Metadata = {
	title: 'Панель администратора - Главсиз',
	description: 'Управление сайтом и товарами',
}

export default async function UserLayout({
	children,
}: // modal,
Readonly<{
	children: React.ReactNode
	// modal: React.ReactNode
}>) {
	const session = await getUserSession()

	if (!session?.id) {
		return <div>Вы не авторизованы</div>
	}

	const user = await prisma.user.findFirst({
		where: { id: Number(session.id) },
	})

	if (!user) {
		return <div>Вы не авторизованы</div>
	}

	if (user.role == Role.USER) {
		return <div>У Вас недостаточно прав для просмотра этой страницы</div>
	}

	return <main className='min-h-screen'>{children}</main>
}
