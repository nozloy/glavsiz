import { Container } from '@/components/shared'
import { CardboardCatalog } from '@/components/shared/cardboard-catalog'
import { CatalogFilters } from '@/components/shared/catalog-filters'
import { ItemBreadcrumb } from '@/components/shared/item-breadcrumb'
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
	const categoryId = searchParams.categoryId
	return (
		<div className='bg-secondary'>
			<ItemBreadcrumb category={categoryId ? items[1]?.category : undefined} />
			<Container className='pt-0 min-h-[calc(50vh)] flex flex-row'>
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
