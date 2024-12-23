export const metadata = {
	title: 'Каталог',
	description:
		'Каталог спецодежды от компании «ГлавСИЗ» – большой выбор рабочей одежды, спецобуви и средств индивидуальной защиты. Высокое качество, сертифицированные товары и удобная доставка по Казани, Уфе и Екатеринбургу. Найдите всё необходимое для охраны труда!',
	metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://glavsiz.ru'),
	alternates: {
		canonical: `${process.env.NEXTAUTH_URL}/catalog`,
	},
	keywords: [
		'каталог',
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

export default function CatalogLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <main>{children}</main>
}
