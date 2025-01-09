import { MobileFooter } from '@/components/shared/mobile/mobile-footer'
import { MobileHeader } from '@/components/shared/mobile/mobile-header'

export default function MobileLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className='flex flex-col min-h-dvh'>
			<MobileHeader />
			{children}
			<MobileFooter />
		</main>
	)
}
