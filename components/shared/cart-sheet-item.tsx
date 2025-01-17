'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { CartItem, OfferWithTypedJson } from '@/store/@types'
import { CountButton } from './count-button'
import { useCityStore } from '@/store/city-store'
import { PriceInfo } from '@/exchange/@types'
import { motion } from 'framer-motion'
interface Props {
	loading?: boolean
	cartItem: CartItem
	className?: string
	onClickCountButton?: (type: 'plus' | 'minus') => void
	removeCartItem: () => void
}

export const CartSheetItem: React.FC<Props> = ({
	loading = false,
	className,
	cartItem,
	onClickCountButton,
	removeCartItem,
}) => {
	const { activeCity } = useCityStore.getState()
	const cityPrice =
		cartItem.Offer.price.find((item: PriceInfo) => item.name === activeCity)
			?.value || 0
	const price = cityPrice ? true : false

	return (
		<div
			className={cn(
				'flex flex-col gap-1 p-5 m-2 bg-background mb-5 rounded-xl shadow-md',
				className,
			)}
		>
			<div className='text-md font-bold'>{cartItem.Offer.Item.name}</div>
			<div className='text-sm text-muted-foreground'>{cartItem.Offer.name}</div>
			<hr className='my-3' />
			<div className='flex flex-row gap-2 justify-between'>
				<CountButton
					loading={loading}
					onClick={onClickCountButton}
					value={cartItem.quantity}
				/>
				<div
					onClick={() => removeCartItem()}
					className='text-md underline cursor-pointer text-muted-foreground'
				>
					Удалить
				</div>
				<motion.div
					key={cartItem.Offer.id + cartItem.quantity}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.3 }}
					className='text-md font-bold'
				>
					{price
						? (cityPrice * cartItem.quantity).toFixed(2) + '₽'
						: 'под заказ'}
				</motion.div>
			</div>
		</div>
	)
}
