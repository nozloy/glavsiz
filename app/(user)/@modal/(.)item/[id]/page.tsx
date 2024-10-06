import { ModalItem } from '@/components/shared/modal'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'

export default async function ProductModalPage({
	params: { id },
}: {
	params: { id: string }
}) {
	const item = await prisma.item.findUnique({
		where: {
			id: Number(id),
		},
	})

	const category = await prisma.category.findFirst({
		where: {
			id: item?.categoryId,
		},
	})

	if (!item || !category) {
		return notFound()
	}

	return <ModalItem item={item} category={category} />
}
