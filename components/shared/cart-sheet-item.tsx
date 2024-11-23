import React from 'react'
import { cn } from '@/lib/utils'
import { CartItem } from '@/store/@types'
import { CountButton } from './count-button'
interface Props {
	item: CartItem
	className?: string
	onClickCountButton?: (type: 'plus' | 'minus') => void
}

export const CartSheetItem: React.FC<Props> = ({
	className,
	item,
	onClickCountButton,
}) => {
	return (
		<></>
		// <div
		// 	className={cn(
		// 		'flex flex-col gap-1 p-5 bg-background mb-5 w-full',
		// 		className,
		// 	)}
		// >
		// 	<div className='text-md font-bold'>{item.name}</div>
		// 	<div className='text-sm text-muted-foreground'>
		// 		{item.variant ? item.variant : ''}
		// 	</div>
		// 	<hr className='my-3' />
		// 	<div className='flex flex-row gap-2 justify-between'>
		// 		<CountButton onClick={onClickCountButton} value={item.quantity} />
		// 		<div className='text-md font-bold'>{item.price * item.quantity}₽</div>
		// 	</div>
		// </div>
	)
}
