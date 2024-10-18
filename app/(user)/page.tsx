import { BestSellers, Container, RecentArrivals } from '@/components/shared'
import { BannerCarousel } from '@/components/shared/banner-carousel'
import { uniqueItems, allCategories } from '@/lib/find-items'
import { Suspense } from 'react'

export default async function Home() {
	const items = await uniqueItems()
	const categories = await allCategories()
	return (
		<div className='bg-secondary'>
			<Container className='flex flex-col items-center justify-center gap-6'>
				<BannerCarousel />
				<BestSellers items={items} categories={categories} />
				<RecentArrivals items={items} categories={categories} />
			</Container>
		</div>
	)
}
