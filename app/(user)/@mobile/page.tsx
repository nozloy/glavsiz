import { MobileBannerCarousel } from '@/components/shared/mobile/mobile-banner-carousel'
import { MobileBestSellers } from '@/components/shared/mobile/mobile-best-sellers'
import { MobileBenefits } from '@/components/shared/mobile/mobile-benefits'

export const dynamic = 'force-dynamic'

export default async function Mobile() {
	return (
		<div className='flex flex-col justify-center relative px-2 overflow-y-scroll overflow-hidden gap-4'>
			<MobileBannerCarousel />
			<MobileBestSellers />
			<MobileBenefits />
		</div>
	)
}
