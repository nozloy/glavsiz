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
		<div className={cn('p-1', className)}>
			<Button
				onClick={() => signOut({ callbackUrl: '/' })}
				variant={'outline'}
				className='p-1 flex items-center gap-1 w-full text-md border-muted-foreground/50 text-muted-foreground'
			>
				<LogOut size={16} />
				Выйти
			</Button>
		</div>
	)
}
