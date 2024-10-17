'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

interface Props {
	className?: string
}

export const SignOutButton: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('', className)}>
			<Button
				onClick={() => signOut({ callbackUrl: '/' })}
				variant={'outline'}
				className='flex items-center gap-1 w-full text-md border-primary-foreground text-primary-foreground'
			>
				<LogOut size={16} />
				Выйти
			</Button>
		</div>
	)
}
