import { Container, RecentArrivals, BestSellers } from '@/components/shared'
import { BannerCarousel } from '@/components/shared/banner-carousel'
import { Benefits } from '@/components/shared/benefits'
export const dynamic = 'force-dynamic'

export default async function Desktop() {
	return (
		<div className='bg-secondary'>
			<Container className='flex flex-col items-center justify-center gap-6'>
				<BannerCarousel />
				<BestSellers />
				<RecentArrivals />
				<Benefits />
			</Container>
		</div>
	)
}
