'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CartSheet } from './cart-sheet'
import { useCartStore } from '@/store/cart-store'
import type { Session } from 'next-auth'
import { useCityStore } from '@/store/city-store'
interface Props {
	className?: string
	session?: Session
}

export const CartButton: React.FC<Props> = ({ className, session }) => {
	const { totalPrice, totalAmount, cartLoading, syncCart } = useCartStore()
	const activeCity = useCityStore(state => state.activeCity)

	useEffect(() => {
		let isFirstLoad = true
		if (session && !isFirstLoad) {
			syncCart() // Пересчёт корзины при смене города
		}
		isFirstLoad = false
	}, [activeCity, syncCart, session])
	return (
		<CartSheet>
			<Button
				loading={cartLoading}
				className={cn(
					'group relative min-w-[110px] transition-all ease-in-out delay-100 ',
					className,
				)}
			>
				<b>{session ? totalPrice : 0} ₽</b>
				<span className='mx-3 h-full w-[1px] bg-white/30' />
				<div className='flex items-center gap-1 transition duration-300 group-hover:opacity-0'>
					<ShoppingCart size={16} className='relative h-4 w-4' />
					<b>{session ? (totalAmount ? totalAmount : 0) : 0}</b>
				</div>
				<ArrowRight
					size={20}
					className='absolute right-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100'
				/>
			</Button>
		</CartSheet>
	)
}
