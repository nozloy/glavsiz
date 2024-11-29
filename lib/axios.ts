'use server'
import axios from 'axios'

// Создаем экземпляр клиента axios
const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || '', // Базовый URL API
	timeout: 5000, // Таймаут запроса
	headers: {
		'Content-Type': 'application/json',
		'x-api-key': process.env.API_SECRET_KEY || '', // Добавляем API_SECRET_KEY в заголовки
	},
})

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
	response => response, // Если ответ успешный, возвращаем его
	error => {
		// Обработка ошибок
		if (!error.response) {
			// Нет ответа от сервера
			console.error('Ошибка сети или сервер не доступен:', error)
			throw new Error('Нет ответа от сервера')
		}

		// Если ошибка от API
		const status = error.response.status
		const errorMessage =
			error.response.data?.message || 'Неизвестная ошибка от API'

		if (status === 404) {
			throw new Error('Запрашиваемый ресурс не найден')
		} else if (status === 500) {
			throw new Error('Ошибка на сервере')
		}

		// Для других ошибок от API
		throw new Error(`Ошибка от сервера: ${status} - ${errorMessage}`)
	},
)

export default apiClient
