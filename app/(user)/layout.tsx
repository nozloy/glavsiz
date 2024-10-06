import type { Metadata } from 'next'
import { Header, Footer } from '@/components/shared/'
import { ParentCategoriesMenu } from '@/components/shared/parent-categories-menu'

export const metadata: Metadata = {
	title: 'Главсиз',
	description: 'сеть магазинов спецодежды',
}

export default function UserLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode
	modal: React.ReactNode
}>) {
	return (
		<main className='flex flex-col min-h-screen'>
			<Header />
			<ParentCategoriesMenu />
			{modal}
			{children}
			<Footer />
		</main>
	)
}
