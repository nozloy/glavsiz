import NotFound from '@/app/not-found'
import { Container } from '@/components/shared'
import { ItemBreadcrumb } from '@/components/shared/item-breadcrumb'
import { ItemDescription } from '@/components/shared/item-description'
import { Product } from '@/components/shared/product'
import { getCategoryById } from '@/lib/find-categories'
import { findItem } from '@/lib/find-items'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata({
	params: { id },
}: {
	params: { id: string }
}): Promise<Metadata> {
	try {
		const item = await findItem(id)
		if (!item) {
			return {
				title: 'Товар не найден',
				description: 'Ссылка устарела или товар больше не продается',
				openGraph: {
					images: [`${process.env.NEXTAUTH_URL}/logo.png`],
				},
			}
		}

		return {
			title: `${item.name} (${item.vendorCode})`,
			description: item.description,
			twitter: {
				card: 'summary_large_image',
			},
			metadataBase: new URL(
				process.env.NEXT_PUBLIC_API_URL || 'https://glavsiz.ru',
			),
			openGraph: {
				type: 'website',
				url: `${process.env.NEXTAUTH_URL}/item/${id}`,
				images: [
					item.images[0]
						? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0]}`
						: `${process.env.NEXTAUTH_URL}/logo.png`,
				],
			},
		}
	} catch (error) {
		console.error('Ошибка при генерации метаданных:', error)
		return {
			title: 'Ошибка',
			description: 'Ошибка при загрузке метаданных',
		}
	}
}

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string }
}) {
	const item = await findItem(id)
	const category = item ? await getCategoryById(item.categoryId) : undefined
	// Если товар не найден, показываем страницу 404
	if (!item) {
		return NotFound() // Рендерим страницу 404
	}
	return (
		<div>
			<Container className='pl-10 pt-6'>
				<ItemBreadcrumb category={category} />
			</Container>
			<Product item={item} />
			{item.description && (
				<ItemDescription className='mt-auto' description={item.description} />
			)}
		</div>
	)
}
