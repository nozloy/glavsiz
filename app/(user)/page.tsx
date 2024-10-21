import { BestSellers, Container, RecentArrivals } from '@/components/shared'
import { BannerCarousel } from '@/components/shared/banner-carousel'
import { Benefits } from '@/components/shared/benefits'
import { uniqueItems, allCategories } from '@/lib/find-items'
import { Suspense } from 'react'

export default async function Home() {
	const items = await uniqueItems()
	const categories = await allCategories()
	return (
		<div className='bg-secondary'>
			<div className='block md:hidden'>
				<h1>Для работы с сайтом используйте ПК или планшет</h1>
			</div>
			<div className='hidden md:block'>
				<Container className='flex flex-col items-center justify-center gap-6'>
					<BannerCarousel />
					{/* <BestSellers items={items} categories={categories} /> */}
					<RecentArrivals items={items} categories={categories} />
					<Benefits />
				</Container>
			</div>
		</div>
	)
}
