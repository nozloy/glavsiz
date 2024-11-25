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
import { Category } from '@prisma/client'
import Link from 'next/link'
import { ItemWithOfferOnly } from '@/@types'

interface Props {
	items: ItemWithOfferOnly[]
	className?: string
}

export const SheetCatalog: React.FC<Props> = ({ className, items }) => {
	const isImage = (item: ItemWithOfferOnly) => {
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
		<div className={cn('rounded-xl shadow-xl bg-background', className)}>
			<Table>
				<TableCaption>Каталог товаров выгрузки.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>Артикул</TableHead>
						<TableHead>Название</TableHead>
						<TableHead>Изображение</TableHead>
						<TableHead>Наличие оффера</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items &&
						items?.map((item: ItemWithOfferOnly, index: number) => (
							<TableRow key={index}>
								<TableCell
									className='font-medium cursor-pointer flex flex-row gap-1'
									onClick={() => handleCopyToClipboard(item.vendorCode || '')}
								>
									<ClipboardCopy size={16} className='ml-2' />
									{item.vendorCode || 'Не указано'}
								</TableCell>

								<TableCell>
									<Link href={`/item/${item.id}/`}>
										{item.name || 'Не указано'}
									</Link>
								</TableCell>
								<TableCell>
									{isImage(item) ? (
										'Есть'
									) : (
										<span className='underline text-red-500 font-bold'>
											Нет
										</span>
									)}
								</TableCell>
								<TableCell>
									{item.Offer[0] ? (
										'Есть'
									) : (
										<span className='underline text-red-500 font-bold'>
											Нет
										</span>
									)}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	)
}
