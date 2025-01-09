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
import type { Category, ParentCategory } from '@prisma/client'
import { CategoryWithParent } from '@/@types'

interface Props {
	className?: string
	category?: CategoryWithParent | ParentCategory
}

export const ItemBreadcrumb: React.FC<Props> = ({ className, category }) => {
	const haveParent =
		(category as CategoryWithParent)?.parentCategory?.name !== undefined
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
				{haveParent ? (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								className='px-2 py-1 bg-muted rounded-2xl'
								href={`/catalog?categoryId=${
									(category as CategoryWithParent).parentCategory?.id
								}`}
							>
								{(category as CategoryWithParent).parentCategory?.name}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</>
				) : (
					<></>
				)}
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
