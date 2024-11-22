'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion' // Импортируем framer-motion и AnimatePresence

type warehouse = {
	name: string
	value: string
}
interface Props {
	className?: string
	warehouses: warehouse[]
	id: string
	city: string
}

export const ItemCount: React.FC<Props> = ({
	className,
	warehouses,
	id,
	city,
}) => {
	return (
		<div className={cn('w-full neo rounded-2xl p-4 mx-auto', className)}>
			<AnimatePresence mode='wait'>
				{warehouses.length > 0 ? (
					<motion.div
						key={id}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.3 }}
					>
						<Badge className='w-full flex flex-col items-start rounded-md select-none text-md font-light text-muted-foreground bg-card hover:bg-card p-3 py-2'>
							{warehouses
								.filter(warehouse => warehouse.name.includes(city))
								.map((warehouse, index) => (
									<div
										key={index}
										className='w-full flex flex-row justify-between'
									>
										<div>
											{warehouse.name.replace(city, '').replace(', ', '')}
										</div>
										<div>{warehouse.value}</div>
									</div>
								))}
						</Badge>
					</motion.div>
				) : (
					<motion.div
						key={id}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.3 }}
					>
						<Badge
							className='select-none text-md bg-muted-foreground'
							variant='destructive'
						>
							Под заказ
						</Badge>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
