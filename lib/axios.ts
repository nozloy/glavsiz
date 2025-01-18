'use server'
import axios from 'axios'

// Создаем экземпляр клиента axios
const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || '', // Базовый URL API
	timeout: 5000, // Таймаут запроса
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		'x-api-key': process.env.API_SECRET_KEY || '', // Добавляем ключ доступа в заголовки
	},
})

// // Интерцептор для отображения заголовков cookies
// apiClient.interceptors.request.use(config => {
// 	console.log('Request cookies:', config.headers['Cookie'])
// 	return config
// })

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
	response => response, // Если ответ успешный, возвращаем его
	error => {
		// Обработка ошибок
		if (!error.response) {
			// Нет ответа от сервера
			console.error('API:Ошибка сети или сервер не доступен:', error)
			throw new Error('API:Нет ответа от бд')
		}

		// Если ошибка от API
		const status = error.response.status
		const errorMessage =
			error.response.data?.message || 'Неизвестная ошибка от API'

		if (status === 404) {
			return new Error('API:Запрашиваемый ресурс не найден')
		} else if (status === 500) {
			throw new Error('API:Ошибка на сервере')
		}

		// Для других ошибок от API
		throw new Error(`API:Ошибка бд: ${status} - ${errorMessage}`)
	},
)

export default apiClient
