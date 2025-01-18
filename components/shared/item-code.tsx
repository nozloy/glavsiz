'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
	className?: string
	code: string | null
	size?: 'sm' | 'md' | 'lg'
}

export const ItemCode: React.FC<Props> = ({ className, code, size }) => {
	const handleCopyToClipboard = () => {
		if (code) {
			navigator.clipboard.writeText(code)
			toast('Артикул скопирован в буфер обмена', {
				icon: '📋',
				duration: 2000,
			})
		} else {
			toast('Артикул отсутствует', {
				icon: '📋',
				duration: 2000,
			})
		}
	}

	return (
		<div
			className={cn(
				'text-secondary-foreground py-[6px] select-none cursor-pointer',
				size ? `text-${size}` : 'text-md',
				className,
			)}
		>
			<AnimatePresence mode='wait'>
				<motion.div
					key={code || 'item-code'}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.3 }}
				>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									className='flex flex-row gap-1 items-center'
									onClick={handleCopyToClipboard}
								>
									<Copy
										size={
											size
												? size === 'sm'
													? 14
													: size === 'md'
													? 16
													: size === 'lg'
													? 18
													: 16
												: 16
										}
										className={className}
									/>
									{code ? code : 'нет артикула'}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Артикул</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
