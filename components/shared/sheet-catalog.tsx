'use client'
import React from 'react'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ClipboardCopy } from 'lucide-react'
import { Container } from './container'
import { Category, Item } from '@prisma/client'

interface Props {
	items: Item[]
	categories: Category[]
	className?: string
}

export const SheetCatalog: React.FC<Props> = ({
	className,
	items,
	categories,
}) => {
	const isImage = (item: Item) => {
		return item.images?.[0] && !item.images[0].includes('default')
	}
	const handleCopyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(
			() => {
				console.log('Артикул скопирован в буфер обмена')
				navigator.clipboard.writeText(text)
				toast('Артикул скопирован в буфер обмена', {
					icon: '📋',
					duration: 2000,
				})
			},
			error => {
				console.error('Не удалось скопировать артикул:', error)
				navigator.clipboard.writeText('Ошибка')
				toast('Не удалось скопировать артикул', {
					icon: '📋',
					duration: 2000,
				})
			},
		)
	}

	return (
		<Container className={cn('', className)}>
			<Table>
				<TableCaption>Каталог товаров выгрузки.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[10px]'>ID</TableHead>
						<TableHead className='w-[100px]'>Артикул</TableHead>
						<TableHead className='w-[15px]'>Остаток</TableHead>
						<TableHead>Название</TableHead>
						<TableHead>Изображение</TableHead>
						<TableHead className='w-[150px]'>Размер</TableHead>
						<TableHead className='text-right'>Стоимость</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items?.map((item: Item, index: number) => (
						<TableRow key={index}>
							<TableCell>{item.id}</TableCell>
							<TableCell
								className='font-medium cursor-pointer flex flex-row gap-1'
								onClick={() => handleCopyToClipboard(item.vendorCode || '')}
							>
								<ClipboardCopy size={16} className='ml-2' />
								{item.vendorCode || 'Не указано'}
							</TableCell>
							<TableCell>{item.count}</TableCell>
							<TableCell>{item.name || 'Не указано'}</TableCell>
							<TableCell>
								{isImage(item) ? (
									'Есть'
								) : (
									<span className='underline text-red-500 font-bold'>Нет</span>
								)}
							</TableCell>
							<TableCell>
								{item.size ? (
									item.size
								) : (
									<span className='underline text-red-500 font-bold'>
										Не указано
									</span>
								)}
							</TableCell>
							<TableCell className='text-right'>
								{item.price ? (
									item.price
								) : (
									<span className='underline text-red-500 font-bold'>
										Нет или 0
									</span>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Container>
	)
}
