import { ItemDescription } from '@/components/shared/item-description'
import { Product } from '@/components/shared/product'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string }
}) {
	const item = await prisma.item.findUnique({
		where: {
			id: id,
		},
	})

	const category = await prisma.category.findFirst({
		where: {
			id: item?.categoryId ?? '',
		},
	})
	const offers = await prisma.offer.findMany({
		where: {
			itemId: item?.id,
		},
	})
	if (!item || !category) {
		return notFound()
	}

	return (
		<div>
			<Product item={item} category={category} offers={offers} />
			{item.description && (
				<ItemDescription className='mt-auto' description={item.description} />
			)}
		</div>
	)
}
