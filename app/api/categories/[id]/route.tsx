import { validateApiKey } from '@/lib/api'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}

	try {
		// Запрашиваем данные из базы
		const category = await prisma.category.findFirst({
			where: { id: params.id },
			include: {
				parentCategory: true, // Указываем, что хотим включить данные о родительской категории
			},
		})

		const parentCategory = await prisma.parentCategory.findFirst({
			where: { id: params.id },
		})

		// Формируем ответ с заголовками кэширования
		const response = NextResponse.json(
			parentCategory ? parentCategory : category,
		)

		// Устанавливаем кэширование
		response.headers.set(
			'Cache-Control',
			`s-maxage=${process.env.REVALIDATE_TIME || 60}, stale-while-revalidate`,
		)

		// Возвращаем результат
		return response
	} catch (error) {
		console.error('API:Ошибка получения данных категорий по ID:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
