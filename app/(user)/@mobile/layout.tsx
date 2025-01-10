import { MobileFooter } from '@/components/shared/mobile/mobile-footer'
import { MobileHeader } from '@/components/shared/mobile/mobile-header'
import NextTopLoader from 'nextjs-toploader'

export default function MobileLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className='flex flex-col min-h-dvh'>
			<NextTopLoader color='#f9cb15' height={5} showSpinner={false} />
			<MobileHeader />
			{children}
			<MobileFooter />
		</main>
	)
}
