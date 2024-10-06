import type { Metadata } from 'next'
import { Header, Footer } from '@/components/shared/'

export const metadata: Metadata = {
	title: 'Главсиз',
	description: 'сеть магазинов спецодежды',
}

export default function UserLayout({
	children,
}: // modal,
Readonly<{
	children: React.ReactNode
	// modal: React.ReactNode
}>) {
	return (
		<main className='min-h-screen'>
			{/* <Header /> */}
			{/* {modal} */}
			{children}
			{/* <Footer /> */}
		</main>
	)
}
