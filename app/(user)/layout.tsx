import { Header, Footer } from '@/components/shared'
import { ParentCategoriesMenu } from '@/components/shared/parent-categories-menu'
import Metrica from '@/components/shared/layout/metrica'
import { isMobile } from '@/lib/is-mobile'
import { headers } from 'next/headers'

export const metadata = {
	title: {
		template: '%s | Главсиз',
		default: 'Главсиз',
	},
	description:
		'Компания «ГлавСИЗ» – лидер в продаже спецодежды, спецобуви и средств индивидуальной защиты в Казани, Уфе и Екатеринбурге. У нас вы найдёте сертифицированные товары для охраны труда, отдыха и туризма. Надёжная защита и комфорт для ваших сотрудников – наш приоритет. Доставка быстро и удобно!',
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_API_URL || 'https://glavsiz.ru',
	),
	keywords: [
		'спецодежда',
		'спецобувь',
		'средства индивидуальной защиты',
		'купить спецодежду',
		'спецодежда Казань',
		'спецодежда Уфа',
		'спецодежда Екатеринбург',
		'магазин спецодежды',
		'СИЗ',
		'одежда для охраны труда',
		'спецодежда для рабочих',
		'защита для сотрудников',
		'товары для туризма',
		'главсиз',
		'спецодежда оптом',
		'защитная одежда',
	],
	openGraph: {
		type: 'website',
		url: process.env.NEXTAUTH_URL,
		logo: `${process.env.NEXTAUTH_URL}/logo_circle.png`,
		images: [`${process.env.NEXTAUTH_URL}/logo.png`],
	},
}

export default function UserLayout({
	modal,
	desktop,
	mobile,
}: Readonly<{
	modal: React.ReactNode
	desktop: React.ReactNode
	mobile: React.ReactNode
}>) {
	// Получаем заголовки на сервере
	const userAgent = headers().get('user-agent') || ''
	const isItMobile = isMobile(userAgent)

	return (
		<main className='flex flex-col bg-background'>
			<Metrica />
			{isItMobile ? (
				<div className='mobile-layout'>
					{modal}
					{mobile}
				</div>
			) : (
				<div className='desktop-layout'>
					<Header />
					<ParentCategoriesMenu />
					{modal}
					{desktop}
					<Footer />
				</div>
			)}
		</main>
	)
}
