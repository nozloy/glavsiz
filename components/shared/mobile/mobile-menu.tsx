import React from 'react'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { findParentCategories } from '@/lib/find-categories'

interface Props {
	className?: string
}

export const MobileMenu: React.FC<Props> = async ({ className }) => {
	const parentCategories = await findParentCategories()
	return (
		<div className={cn('', className)}>
			<Sheet>
				<SheetTrigger asChild>
					<Menu size={24} />
				</SheetTrigger>
				<SheetContent side={'left'} className='flex flex-col '>
					<SheetHeader>
						<SheetTitle>
							<Image src={'/logo.svg'} alt='logo' width={240} height={24} />
						</SheetTitle>
						{/* <SheetDescription>
							Change your personal information and settings
						</SheetDescription> */}
					</SheetHeader>
					<div className='flex flex-col gap-2 pt-10'>
						{parentCategories.map(parentCategory => (
							<div
								key={parentCategory.id}
								className='flex flex-row gap-3 items-center justify-start rounded-xl bg-card shadow-md p-1 border border-primary border-dashed'
							>
								<Image
									src={'/images/icons/' + parentCategory.icon}
									alt='logo'
									width={28}
									height={28}
								/>
								<div className='text-xl font-bold'>{parentCategory.name}</div>
							</div>
						))}
					</div>
					<SheetFooter className='mt-auto'>
						<Button className='mt-auto w-full'>Войти</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	)
}
