'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CircleUser, User } from 'lucide-react'
import Link from 'next/link'
import { ModalAuth } from '../modal/modal-auth'

interface Props {
	className?: string
}

export const MobileAuthButton: React.FC<Props> = ({ className }) => {
	const [openAuthModal, setOpenAuthModal] = React.useState(false)
	const { data: session, status } = useSession()
	return (
		<div className={cn('', className)}>
			{!session ? (
				<Button
					loading={status === 'loading'}
					className='flex items-center gap-1 w-full'
					onClick={() => setOpenAuthModal(true)}
				>
					<User size={16} />
					Войти
				</Button>
			) : (
				<Link href={'/profile'}>
					<Button loading={false} className='flex items-center gap-1 w-full'>
						<CircleUser size={16} />
						Профиль
					</Button>
				</Link>
			)}
			<ModalAuth open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
		</div>
	)
}
