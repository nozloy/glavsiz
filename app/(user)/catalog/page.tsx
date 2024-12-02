import { Container } from '@/components/shared'
import { CardboardCatalog } from '@/components/shared/cardboard-catalog'
import { CatalogFilters } from '@/components/shared/catalog-filters'
import { filteredItems, GetSearchParams } from '@/lib/find-items'

export const dynamic = 'force-dynamic'
export default async function Page({
	searchParams,
}: {
	searchParams: GetSearchParams
}) {
	const minPrice = Number(searchParams.priceFrom) || 0
	const maxPrice = Number(searchParams.priceTo) || 10000

	const items = await filteredItems(searchParams)
	return (
		<div className='bg-secondary'>
			<Container className='min-h-[calc(50vh)] flex flex-row'>
				<CatalogFilters />
				<CardboardCatalog
					items={items}
					minPrice={minPrice}
					maxPrice={maxPrice}
				/>
			</Container>
		</div>
	)
}
