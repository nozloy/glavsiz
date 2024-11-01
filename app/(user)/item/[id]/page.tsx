import { ItemDescription } from '@/components/shared/item-description'
import { Product } from '@/components/shared/product'
import { prisma } from '@/prisma/prisma-client'
import { Item } from '@prisma/client'
import { notFound } from 'next/navigation'

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string }
}) {
	const item = await prisma.item.findUnique({
		where: {
			id: Number(id),
		},
	})
	const vendorId = item?.vendorCode
	let variants: Item[] = []
	if (vendorId) {
		variants = await prisma.item.findMany({
			where: {
				vendorCode: vendorId,
			},
		})
	}

	const category = await prisma.category.findFirst({
		where: {
			id: item?.categoryId,
		},
	})

	if (!item || !category) {
		return notFound()
	}

	return (
		<div>
			<Product item={item} category={category} variants={variants} />
			{item.description && (
				<ItemDescription className='mt-auto' description={item.description} />
			)}
		</div>
	)
}
