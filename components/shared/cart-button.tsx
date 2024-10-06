import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CartSheet } from './cart-sheet'

interface Props {
	className?: string
}

export const CartButton: React.FC<Props> = ({ className }) => {
	return (
		<CartSheet>
			<Button className={cn('group relative', className)}>
				<b>0 ₽</b>
				<span className='mx-3 h-full w-[1px] bg-white/30' />
				<div className='flex items-center gap-1 transition duration-300 group-hover:opacity-0'>
					<ShoppingCart size={16} className='relative h-4 w-4' />
					<b>0</b>
				</div>
				<ArrowRight
					size={20}
					className='absolute right-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100'
				/>
			</Button>
		</CartSheet>
	)
}
