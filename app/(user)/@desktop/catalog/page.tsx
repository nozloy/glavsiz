import { Container } from '@/components/shared'
import { CardboardCatalog } from '@/components/shared/cardboard-catalog'
import { CatalogFilters } from '@/components/shared/catalog-filters'
import { ItemBreadcrumb } from '@/components/shared/item-breadcrumb'
import { SortBy } from '@/components/shared/sort-by'
import { getCategoryById } from '@/lib/find-categories'
import { filteredItems, GetSearchParams, getItemTypes } from '@/lib/find-items'

export const dynamic = 'force-dynamic'
export default async function Page({
	searchParams,
}: {
	searchParams: GetSearchParams
}) {
	const minPrice = Number(searchParams.priceFrom) || 0
	const maxPrice = Number(searchParams.priceTo) || 10000
	const sortBy = searchParams.sortBy || 'priceUp'

	const items = await filteredItems(searchParams)
	const itemAllTypes = await getItemTypes()
	const itemTypes = [
		...new Set(
			items.filter(item => item.itemType !== null).map(item => item.itemType),
		),
	] as string[]
	const categoryId = searchParams.categoryId
	const category = categoryId ? await getCategoryById(categoryId) : undefined
	return (
		<div className='bg-secondary'>
			<Container className='pl-10 pb-0 flex flex-row justify-between items-center w-full'>
				<ItemBreadcrumb category={category ? category : undefined} />
				<SortBy />
			</Container>
			<Container className='pt-0 min-h-[calc(50vh)] flex flex-row'>
				<CatalogFilters itemTypes={categoryId ? itemTypes : itemAllTypes} />
				<CardboardCatalog
					items={items}
					minPrice={minPrice}
					maxPrice={maxPrice}
					sortBy={sortBy}
				/>
			</Container>
		</div>
	)
}
