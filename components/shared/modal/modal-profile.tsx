'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'

interface Props {
	className?: string
}

export const ModalProfile: React.FC<Props> = ({ className }) => {
	const router = useRouter()

	const { data: session } = useSession()
	return (
		<div className={cn('', className)}>
			<Dialog open={Boolean(status)} onOpenChange={() => router.back()}>
				<DialogOverlay className='fixed inset-0 bg-black/25 grid place-items-center overflow-y-auto overflow-scroll'>
					<DialogContent className='p-0 w-[890px] max-w-[890px] h-[630px] bg-white overflow-hidden flex'>
						<DialogHeader className='flex flex-col gap-1'>
							<div className='flex flex-row justify-between'>
								<DialogDescription>
									<p>
										Вы вошли как {session?.user?.email || session?.user?.name}
									</p>
								</DialogDescription>
							</div>
							<DialogTitle className='flex flex-col gap-2'>
								<p className='text-2xl'>{}</p>
							</DialogTitle>
						</DialogHeader>
						<Button
							onClick={() => signOut()}
							variant={'outline'}
							className='absolute top-5 right-5'
						>
							Выйти
						</Button>
					</DialogContent>
				</DialogOverlay>
			</Dialog>
		</div>
	)
}
