import { Container, RecentArrivals } from '@/components/shared'
import { BannerCarousel } from '@/components/shared/banner-carousel'
import { Benefits } from '@/components/shared/benefits'
import { MobileVersion } from '@/components/shared/mobile-version'

export const dynamic = 'force-dynamic'

export default async function Home() {
	return (
		<div className='bg-secondary'>
			<div className='block md:hidden'>
				<MobileVersion />
			</div>
			<div className='hidden md:block'>
				<Container className='flex flex-col items-center justify-center gap-6'>
					<BannerCarousel />
					<RecentArrivals />
					<Benefits />
				</Container>
			</div>
		</div>
	)
}
function newItems() {
	throw new Error('Function not implemented.')
}
