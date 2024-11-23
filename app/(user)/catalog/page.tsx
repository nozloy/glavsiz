import { CardboardCatalog } from '@/components/shared/cardboard-catalog'
import { filteredItems, GetSearchParams } from '@/lib/find-items'
export const dynamic = 'force-dynamic'
export default async function Page({
	searchParams,
}: {
	searchParams: GetSearchParams
}) {
	const items = await filteredItems(searchParams)
	return (
		<div className='bg-secondary'>
			<CardboardCatalog items={items} />
		</div>
	)
}
