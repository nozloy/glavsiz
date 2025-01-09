import type { Metadata } from 'next'
import { getRoleOrUnauthorized, getUserSession } from '@/lib/get-session'
import { Role } from '@prisma/client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/shared/dashboard/app-sidebar'

export const metadata: Metadata = {
	title: 'Панель администратора - Главсиз',
	description: 'Управление сайтом и товарами',
}

export default async function UserLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const role = await getRoleOrUnauthorized()

	if (!role) {
		return <div>Вы не авторизованы</div>
	}

	if (role == Role.USER) {
		return <div>У Вас недостаточно прав</div>
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='w-full'>
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	)
}
