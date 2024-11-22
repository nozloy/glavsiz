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
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { Title } from './title'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { useSession } from 'next-auth/react'
import { CartSheetItem } from './cart-sheet-item'

export const CartSheet: React.FC<React.PropsWithChildren> = ({ children }) => {
	const {
		initializeCart,
		addCartItem,
		removeCartItem,
		updateCartItemQuantity,
		syncCart,
		items,
		loading,
	} = useCartStore(state => state)
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

	const onClickCountButton = (
		id: string,
		quantity: number,
		type: 'plus' | 'minus',
	) => {
		if (session) {
			const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1
			updateCartItemQuantity(id, newQuantity)
		}
	}
	const totalAmount = 100
	const totalPrice = 100

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className='flex flex-col justify-between pb-0 bg-[#F4F1EE]'>
				<div className={cn('flex flex-col h-full', !items && 'justify-center')}>
					{items && (
						<SheetHeader>
							<SheetTitle>
								В корзине{' '}
								<span className='font-bold'>
									{totalAmount} {getItemWord(totalAmount)}
								</span>
							</SheetTitle>
						</SheetHeader>
					)}
					{!items && (
						<div className='flex flex-col items-center justify-center w-72 mx-auto'>
							<Image
								src='/icon2.svg'
								alt='Empty cart'
								width={120}
								height={120}
							/>
							<Title
								size='sm'
								text='Корзина пустая'
								className='text-center font-bold my-2'
							/>
							<p className='text-center text-neutral-500 mb-5'>
								Добавьте хотя бы один продукт, чтобы совершить заказ
							</p>
							<SheetClose>
								<Button className='w-56 h-12 text-base' size='lg'>
									<ArrowLeft className='w-5 mr-2' /> Вернуться назад
								</Button>
							</SheetClose>
						</div>
					)}
					{items && items.length > 0 && session && (
						<>
							<div className='-mx-6 mt-5 overflow-auto flex-1'>
								{items.map(item => (
									<CartSheetItem
										key={item.itemId}
										item={item}
										onClickCountButton={type =>
											onClickCountButton(item.itemId, item.quantity, type)
										}
									/>
								))}
							</div>
							<div>
								{/* <Button
									loading={loading}
									variant='outline'
									className='w-full h-12 text-base'
									onClick={() => emptyCart(Number(session.user.id))}
								>
									Очистить корзину
								</Button> */}
							</div>
							<SheetFooter className='-mx-6 bg-white p-8'>
								<div className='w-full'>
									<div className='flex mb-4'>
										<span className='flex flex-1 text-lg text-neutral-500'>
											Итого
											<div className='flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2' />
										</span>
										<span className='font-bold text-lg'>{totalPrice} ₽</span>
									</div>
								</div>
							</SheetFooter>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
