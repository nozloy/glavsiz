import React from 'react'
import { cn } from '@/lib/utils'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Container } from './container'
import type { Category } from '@prisma/client'

interface Props {
	className?: string
	category?: Category
}

export const ItemBreadcrumb: React.FC<Props> = ({ className, category }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href='/'>Главная</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink
						className='px-2 py-1 bg-muted/50 rounded-2xl'
						href={`/catalog`}
					>
						Каталог
					</BreadcrumbLink>
				</BreadcrumbItem>
				{category ? (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								className='px-2 py-1 bg-muted rounded-2xl'
								href={`/catalog?categoryId=${category?.id}`}
							>
								{category?.name}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</>
				) : (
					<></>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
