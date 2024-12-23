import { Montserrat } from 'next/font/google'
import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/shared/providers'
import FaviconSwitcher from '@/components/shared/layout/favicon-switcher'
const montserrat = Montserrat({
	subsets: ['cyrillic'],
	variable: '--font-montserrat',
	weight: ['400', '500', '600', '700', '800', '900'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<head>
				<link rel='icon' href='/icon.svg' />
				<link
					rel='search'
					type='application/opensearchdescription+xml'
					title='Glavsiz.ru'
					href='/opensearch'
				/>
			</head>
			<body
				className={cn(
					'min-h-dvh bg-background font-montserrat antialiased',
					montserrat.variable,
				)}
			>
				<FaviconSwitcher />
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
