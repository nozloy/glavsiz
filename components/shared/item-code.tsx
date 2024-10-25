import React from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
	className?: string
	code: string
}

export const ItemCode: React.FC<Props> = ({ className, code }) => {
	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(code)
		toast('Артикул скопирован в буфер обмена', {
			icon: '📋',
			duration: 2000,
		})
	}

	return (
		<div className={cn('text-secondary-foreground', className)}>
			<AnimatePresence mode='wait'>
				<motion.div
					key={code}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.3 }}
				>
					<div
						className='py-[6px] select-none text-md cursor-pointer'
						onClick={handleCopyToClipboard}
					>
						<div className='flex flex-row gap-1 items-center'>
							<Copy size={16} className='ml-2' />
							<p>Артикул:</p>
							{code}
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
