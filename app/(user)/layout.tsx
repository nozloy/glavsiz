import type { Metadata } from 'next'
import { Header, Footer } from '@/components/shared/'
import { ParentCategoriesMenu } from '@/components/shared/parent-categories-menu'
import Head from 'next/head'

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
		<main className='flex flex-col min-h-dvh md:min-h-screen'>
			<Head>
				<link
					rel='preload'
					href='/images/icons/cover_material.png'
					as='image'
				></link>
				<link rel='preload' href='/images/icons/hhgoods.png' as='image'></link>
				<link rel='preload' href='/images/icons/turism.png' as='image'></link>
				<link rel='preload' href='/images/icons/clothes.png' as='image'></link>
				<link rel='preload' href='/images/icons/shoes.png' as='image'></link>
				<link rel='preload' href='/images/icons/ppe.png' as='image'></link>
				<link rel='preload' href='/images/icons/gloves.png' as='image'></link>
				<link rel='preload' href='/logo_black.svg' as='image'></link>
				<link rel='preload' href='/logo.svg' as='image'></link>
			</Head>
			<Header />
			<ParentCategoriesMenu />
			{modal}
			{children}
			<Footer />
		</main>
	)
}
