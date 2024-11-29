'use server'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	// Извлекаем API ключ из заголовков запроса
	const apiKey = req.headers.get('x-api-key')

	// Получаем секретный ключ из переменных окружения
	const expectedApiKey = process.env.API_SECRET_KEY

	// Проверяем, совпадает ли ключ
	if (apiKey !== expectedApiKey) {
		// Если ключ неверный, возвращаем ошибку 403
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}

	// Если ключ верный, продолжаем выполнение
	try {
		// Запрашиваем данные из базы
		const items = await prisma.item.findMany({
			select: {
				id: true,
				createdAt: true,
			},
		})

		// Возвращаем данные
		return NextResponse.json(items)
	} catch (error) {
		console.error('Ошибка получения товаров:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
