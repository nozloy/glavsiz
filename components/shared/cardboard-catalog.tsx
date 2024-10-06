import { cn } from '@/lib/utils'
import { Container } from './container'
import { ItemCard } from './item-card'
import { Item, Category } from '@prisma/client'

interface Props {
	items: Item[]
	categories: Category[]
	className?: string
}

export const CardboardCatalog: React.FC<Props> = ({
	items,
	categories,
	className,
}) => {
	return (
		<Container className={cn('grid grid-cols-4', className)}>
			{items.map((item: Item, index: number) => (
				<ItemCard
					key={index}
					className='m-2'
					item={item}
					category={categories.filter(cat => cat.id === item.categoryId)[0]}
					images={item.images}
				/>
			))}
		</Container>
	)
}
