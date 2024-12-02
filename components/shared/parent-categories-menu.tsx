import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { capitalizeFirstLetter, cn } from '@/lib/utils'
import { prisma } from '@/prisma/prisma-client'
import { Prisma, ParentCategory } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { Container } from './container'

interface Props {
	className?: string
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className,
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>{title}</div>
					<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = 'ListItem'

export const ParentCategoriesMenu: React.FC<Props> = async ({ className }) => {
	const parentCategories = await prisma.parentCategory.findMany({
		orderBy: {
			order: 'asc', // По возрастанию
		},
	})
	const categories = await prisma.category.findMany()

	return (
		<div className='z-10 w-full pt-0 bg-background pb-2 pl-2 border-b sticky top-0 hidden md:block'>
			<Container className='py-0'>
				<NavigationMenu
					className={cn(
						' flex flex-row justify-between items-center ',
						className,
					)}
				>
					<NavigationMenuList>
						{parentCategories.map(parentCategory => (
							<NavigationMenuItem key={parentCategory.name}>
								<NavigationMenuTrigger className='font-bold'>
									{parentCategory.name}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='grid grid-rows-6 gap-3 p-4 md:w-[800px] lg:w-[1000px] lg:grid-cols-[1fr_0.8fr_0.8fr]'>
										<li className='row-span-6'>
											<NavigationMenuLink asChild>
												<a
													className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md transition-all duration-300'
													href='/'
												>
													<img
														className='h-48 w-48 mx-auto'
														src={'/images/icons/' + parentCategory.icon}
														alt={'logo'}
													/>
													{/* <Image
														className='h-48 w-48 mx-auto'
														src={'/images/icons/' + parentCategory.icon}
														alt={'logo'}
														width={192}
														height={192}
														priority
													/> */}
													<div className='mb-2 mt-4 text-lg font-medium'>
														{parentCategory.name}
													</div>
													<p className='text-sm leading-tight text-muted-foreground'>
														{parentCategory.description}
													</p>
												</a>
											</NavigationMenuLink>
										</li>
										{categories
											.filter(
												category =>
													category.parentCategoryId === parentCategory.id,
											)
											.map(category => (
												<NavigationMenuLink
													href={'/catalog?categoryId=' + category.id}
													title={category.name}
													key={category.name}
													className={cn(
														navigationMenuTriggerStyle(),
														'w-full h-full row-span-1 p-2 border rounded-xl shadow-md text-center cursor-pointer select-none hover:scale-105 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300',
													)}
												>
													{capitalizeFirstLetter(category.name)}
												</NavigationMenuLink>
											))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</Container>
		</div>
	)
}
