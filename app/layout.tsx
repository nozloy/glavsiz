import { Montserrat } from 'next/font/google'
import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/shared/providers'
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
				<link
					rel='icon'
					href='/icon?<generated>'
					type='image/<generated>'
					sizes='<generated>'
				/>
				<link
					rel='search'
					type='application/opensearchdescription+xml'
					title='Glavsiz.ru'
					href='/opensearch'
				/>
			</head>
			<body
				className={cn(
					'min-h-screen bg-background font-montserrat antialiased',
					montserrat.variable,
				)}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
