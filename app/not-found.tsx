import Link from 'next/link'
import Image from 'next/image'
export default function NotFound() {
	return (
		<div className='w-full grow flex flex-col items-center justify-center gap-4'>
			<Image
				src='/logo_black.svg'
				alt='404'
				priority
				width={288}
				height={288}
			/>
			<h2 className='text-3xl font-bold'>Ошибка 404</h2>
			<p>Не можем найти требуемый ресурс</p>
			<Link className='underline' href='/'>
				Вернуться на главную
			</Link>
		</div>
	)
}
