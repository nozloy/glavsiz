import { CardboardCatalog } from '@/components/shared/cardboard-catalog'
import { allCategories, findItems, GetSearchParams } from '@/lib/find-items'

export default async function Page({
	searchParams,
}: {
	searchParams: GetSearchParams
}) {
	const items = await findItems(searchParams)
	const categories = await allCategories()
	return (
		<div className='bg-secondary'>
			<CardboardCatalog items={items} categories={categories} />
		</div>
	)
}
