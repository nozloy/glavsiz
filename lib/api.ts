import { NextRequest } from 'next/server'

// Функция для проверки API-ключа
export function validateApiKey(req: NextRequest): boolean {
	const apiKey = req.headers.get('x-api-key')
	const expectedApiKey = process.env.API_SECRET_KEY
	return apiKey === expectedApiKey
}
