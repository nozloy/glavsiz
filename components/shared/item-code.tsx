import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardCopy } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
	className?: string
	code: string
}

export const ItemCode: React.FC<Props> = ({ className, code }) => {
	const handleCopyToClipboard = () => {
		console.log('click')
		navigator.clipboard.writeText(code)
		toast('Артикул скопирован в буфер обмена', {
			icon: '📋',
			duration: 2000,
		})
	}

	return (
		<div className={cn('', className)}>
			<AnimatePresence mode='wait'>
				<motion.div
					key={code}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.3 }}
				>
					<Badge
						className='select-none text-md cursor-pointer'
						onClick={handleCopyToClipboard}
					>
						{code}
						<ClipboardCopy size={16} className='ml-2' />
					</Badge>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
