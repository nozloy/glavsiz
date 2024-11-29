import { ItemDescription } from '@/components/shared/item-description'
import { Product } from '@/components/shared/product'
import { findItem } from '@/lib/find-items'
import { notFound } from 'next/navigation'

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string }
}) {
	const item = await findItem(id)
	if (!item) {
		return notFound()
	}

	return (
		<div>
			<Product item={item} />
			{item.description && (
				<ItemDescription className='mt-auto' description={item.description} />
			)}
		</div>
	)
}
