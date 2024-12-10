import { Container } from '@/components/shared'
import { ItemBreadcrumb } from '@/components/shared/item-breadcrumb'
import { ItemDescription } from '@/components/shared/item-description'
import { Product } from '@/components/shared/product'
import { findItem } from '@/lib/find-items'
import { Item } from '@radix-ui/react-select'
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
			<Container className='pl-10 pt-6'>
				<ItemBreadcrumb category={item.category} />
			</Container>
			<Product item={item} />
			{item.description && (
				<ItemDescription className='mt-auto' description={item.description} />
			)}
		</div>
	)
}
