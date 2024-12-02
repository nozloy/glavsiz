import { Header, Footer } from '@/components/shared/'
import { ParentCategoriesMenu } from '@/components/shared/parent-categories-menu'

export const metadata = {
	title: 'Главсиз',
	description: 'сеть магазинов спецодежды',
	openGraph: {
		images: [
			'/images/icons/cover_material.png',
			'/images/icons/hhgoods.png',
			'/images/icons/turism.png',
			'/images/icons/clothes.png',
			'/images/icons/shoes.png',
			'/images/icons/ppe.png',
			'/images/icons/gloves.png',
			'/logo_black.svg',
			'/logo.svg',
		],
	},
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
			<Header />
			<ParentCategoriesMenu />
			{modal}
			{children}
			<Footer />
		</main>
	)
}
