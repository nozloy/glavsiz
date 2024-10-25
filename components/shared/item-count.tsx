import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion' // Импортируем framer-motion и AnimatePresence

interface Props {
	className?: string
	count: number
	id: number
}

export const ItemCount: React.FC<Props> = ({ className, count, id }) => {
	return (
		<div className={cn('', className)}>
			<AnimatePresence mode='wait'>
				{count > 0 ? (
					<motion.div
						key={id}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.3 }}
					>
						<Badge className='rounded-md select-none text-md text-secondary-foreground bg-card hover:bg-card p-3 py-2'>
							В наличии {count} шт.
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
