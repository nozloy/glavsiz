import { cn } from '@/lib/utils'
import { Container } from './container'
import { ItemCard } from './item-card'
import { ItemWithOffer } from '@/@types'

interface Props {
	items: ItemWithOffer[]
	className?: string
}

export const CardboardCatalog: React.FC<Props> = ({ items, className }) => {
	return (
		<Container className={cn('grid grid-cols-4', className)}>
			{items.map((item: ItemWithOffer, index: number) => (
				<ItemCard key={index} className='m-2' item={item} />
			))}
		</Container>
	)
}
