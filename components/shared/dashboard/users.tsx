import React from 'react'
import { cn } from '@/lib/utils'
import { SheetUsers } from './sheet-users'
import { prisma } from '@/prisma/prisma-client'
import { allUsers } from '@/lib/find-users'

interface Props {
	className?: string
}

export const Users: React.FC<Props> = async ({ className }) => {
	const users = await allUsers()
	return (
		<div className={cn('p-4', className)}>
			<SheetUsers users={users} />
		</div>
	)
}
