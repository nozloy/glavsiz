import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Skeleton } from '../ui/skeleton'

interface Props {
	className?: string
}

export const Loader: React.FC<Props> = ({ className }) => {
	const router = useRouter()
	return (
		<Dialog open={true} onOpenChange={() => router.back()}>
			<DialogContent
				className={cn(
					'p-0 w-[890px] max-w-[890px] min-h-[530px] bg-white overflow-hidden flex',
					className,
				)}
			>
				<div className='w-[382px] h-[509] flex-1'>
					<Skeleton className='w-[382px] h-[509px] shadow-md rounded-xl relative top-2 left-2 transition-all z-10 duration-300' />
				</div>
				<div className='w-[490px] bg-secondary/50 p-5 flex flex-col gap-1 shadow-md rounded-r-xl'>
					<DialogHeader className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<DialogDescription>
								<Skeleton className='w-[180px]' />
							</DialogDescription>
						</div>

						<DialogTitle className='text-2xl'>
							<Skeleton className='w-[180px]' />
						</DialogTitle>
					</DialogHeader>
					<p className='text-sm text-secondary-foreground'>
						<Skeleton className='w-[180px]' />
					</p>
					<div className='flex flex-row gap-2 pt-4'>
						<Skeleton className='w-[180px]' />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
