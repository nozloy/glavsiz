'use server'
import { validateApiKey } from '@/lib/api'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}
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
