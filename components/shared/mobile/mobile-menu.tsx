import React from 'react'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { findParentCategories } from '@/lib/find-categories'
import Link from 'next/link'
import { MobileAuthButton } from './mobile-auth-button'

interface Props {
	className?: string
}

export const MobileMenu: React.FC<Props> = async ({ className }) => {
	const parentCategories = await findParentCategories()

	return (
		<div className={cn('', className)}>
			<Sheet>
				<SheetTrigger asChild>
					<Menu size={30} />
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
							<SheetClose asChild key={parentCategory.id}>
								<Link
									href={`/catalog?categoryId=${parentCategory.id}`}
									replace
									className='flex flex-row gap-3 items-center justify-start rounded-xl bg-card shadow-md p-1 border border-primary border-dashed'
								>
									<Image
										src={'/images/icons/' + parentCategory.icon}
										alt='logo'
										width={28}
										height={28}
									/>
									<div className='text-xl font-bold'>{parentCategory.name}</div>
								</Link>
							</SheetClose>
						))}
					</div>
					<SheetFooter className='mt-auto'>
						<MobileAuthButton />
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	)
}
