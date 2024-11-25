'use client'

import { cn } from '@/lib/utils'
import { Api } from '@/services/api-clients'
import { Item } from '@prisma/client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useClickAway, useDebounce } from 'react-use'

interface Props {
	className?: string
}

export const SearchInput: React.FC<Props> = ({ className }) => {
	const [searchQuery, setSearchQuery] = React.useState('')
	const [focused, setFocused] = React.useState(false)
	const [items, setItems] = React.useState<Item[]>([])
	const ref = React.useRef(null)

	useClickAway(ref, () => {
		setFocused(false)
	})

	// Хук useDebounce для отправки асинхронного запроса при изменении searchQuery
	useDebounce(
		async () => {
			try {
				if (!searchQuery) return
				const response = await Api.items.search(searchQuery, 10)
				setItems(response)
			} catch (error) {
				console.log(error)
			}
		},
		250,
		[searchQuery],
	)

	// Обработка нажатия Enter в строке поиска
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault() // Предотвращаем стандартное поведение
			setFocused(false)
			const param = searchQuery
			if (param) {
				window.location.href = `/catalog?query=${param}&count=50`
			}
		} else if (event.key === 'Escape') {
			setFocused(false)
			setSearchQuery('')
		}
	}

	// Функция для обработки клика по элементу списка
	const onClickItem = () => {
		setFocused(false)
		setSearchQuery('')
		setItems([])
	}

	// Возобновлять фокус при печати в строке поиска
	const makeFocused = (value: string) => {
		setSearchQuery(value)
		setFocused(true)
	}

	return (
		<>
			{focused && (
				<div className='fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30' />
			)}

			<div
				ref={ref}
				className={cn(
					'flex rounded-2xl flex-1 justify-between relative h-11 z-30',
					className,
				)}
			>
				<Search className='absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400' />
				<input
					className='rounded-2xl outline-none w-full bg-gray-100 pl-11'
					type='text'
					placeholder='Найти...'
					onFocus={() => setFocused(true)}
					value={searchQuery}
					onChange={e => makeFocused(e.target.value)}
					onKeyDown={handleKeyDown} // Обработка нажатий клавиш
				/>

				{items.length > 0 && (
					<div
						className={cn(
							'absolute w-full bg-white rounded-xl top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30',
							focused && 'visible opacity-100 top-12',
						)}
					>
						{items.map((item, index) => (
							<Link
								onClick={onClickItem}
								key={item.id}
								className={cn(
									'flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10',
									index === 0 && 'hover:rounded-t-xl', // Закругление верхнего края при наведении на первый элемент
									index === items.length - 1 && 'hover:rounded-b-xl', // Закругление нижнего края при наведении на последний элемент
								)}
								href={`/item/${item.id}`}
							>
								<span>{item.name}</span>
							</Link>
						))}
					</div>
				)}
			</div>
		</>
	)
}
