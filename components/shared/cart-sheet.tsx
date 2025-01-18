'use client'
import React from 'react'
import Image from 'next/image'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { useSession } from 'next-auth/react'
import { CartSheetItem } from './cart-sheet-item'
import { Offer } from '@prisma/client'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

export const CartSheet: React.FC<React.PropsWithChildren> = ({ children }) => {
	const {
		removeCartItem,
		updateCartItemQuantity,
		syncCart,
		emptyCart,
		cartItems,
		cartLoading,
		totalPrice,
		totalAmount,
	} = useCartStore()
	const { data: session } = useSession()

	const getItemWord = (count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) return 'товар'
		if (
			count % 10 >= 2 &&
			count % 10 <= 4 &&
			(count % 100 < 10 || count % 100 >= 20)
		)
			return 'товара'
		return 'товаров'
	}

	const onClickCountButton = (offer: Offer, type: 'plus' | 'minus') => {
		if (session) {
			const quantity: number = type === 'plus' ? 1 : -1
			updateCartItemQuantity(offer, quantity)
		}
	}

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className='flex flex-col justify-between pb-0 bg-[#F4F1EE]'>
				<div className={cn('flex flex-col h-full justify-start')}>
					<SheetHeader>
						<SheetTitle>
							{cartItems?.length
								? `${cartItems.length} ${getItemWord(totalAmount)} в корзине`
								: `Нет товаров`}
						</SheetTitle>
						<SheetDescription>
							<span
								className={cn(
									cartItems?.length
										? 'w-full h-12 text-base underline cursor-pointer'
										: 'hidden',
								)}
								onClick={() => emptyCart()}
							>
								{cartItems?.length ? `Очистить корзину` : ``}
							</span>
						</SheetDescription>
					</SheetHeader>

					{!cartItems?.length && (
						<div className='grow flex flex-col items-center gap-4 justify-center w-72 mx-auto'>
							<Image
								src='/icon2.svg'
								alt='Empty cart'
								width={120}
								height={120}
							/>
							<p className='text-center text-muted-foreground mb-5'>
								Добавьте хотя бы один продукт, чтобы совершить заказ
							</p>
							<SheetClose>
								<div className='w-56 h-12 text-base font-bold flex items-center justify-center rounded-xl shadow-md bg-primary text-popover'>
									<ArrowLeft className='w-5 mr-2' /> Вернуться назад
								</div>
							</SheetClose>
						</div>
					)}
					{cartItems && cartItems.length > 0 && session && (
						<>
							<div className='-mx-6 mt-2 overflow-auto flex-1 flex-col gap-1'>
								{cartItems.map(cartItem => (
									<CartSheetItem
										loading={cartLoading}
										key={cartItem.offerId}
										cartItem={cartItem}
										onClickCountButton={type =>
											onClickCountButton(cartItem.Offer, type)
										}
										removeCartItem={() => removeCartItem(cartItem.Offer)}
									/>
								))}
							</div>

							<SheetFooter className=' -mx-6 bg-white p-8'>
								<div className='w-full flex flex-col'>
									<div className='flex mb-4'>
										<span className='flex flex-1 text-lg text-neutral-500'>
											Итого
											<div className='flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2' />
										</span>
										<motion.div
											key={totalPrice}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											transition={{ duration: 0.3 }}
											className='font-bold text-lg'
										>
											{totalPrice} ₽
										</motion.div>
									</div>
									<Button
										className='w-full'
										disabled={true}
										// disabled={cartLoading}
										onClick={() => syncCart()}
									>
										Оформить заказ
									</Button>
								</div>
							</SheetFooter>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
