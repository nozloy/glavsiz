import { CardboardCatalog } from '@/components/shared/cardboard-catalog'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'

export default async function ProductModalPage({
	params: { id },
}: {
	params: { id: string }
}) {
	const category = await prisma.category.findFirst({
		where: {
			id: Number(id),
		},
	})

	const item = await prisma.item.findMany({
		distinct: ['vendorCode'],
		where: {
			categoryId: Number(id),
		},
	})

	if (item.length === 0) {
		return (
			<div className='text-md text-muted-foreground flex flex-col items-center justify-center p-10'>
				В данной категории нет товаров.
			</div>
		)
	}

	if (!category) {
		return notFound()
	}

	return <CardboardCatalog items={item} categories={[category]} />
}
