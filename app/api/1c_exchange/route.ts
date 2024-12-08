import crypto from 'crypto'
import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { uploadExtractedImagesBatch } from '@/exchange/s3-image-upload'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const sessions = new Map()
const UPLOAD_DIR = path.resolve('./uploads')

const AUTH_USERNAME = process.env.EXCHANGE_LOGIN
const AUTH_PASSWORD = process.env.EXCHANGE_PASSWORD

// Функция генерации ID сессии
function generateSessionID() {
	console.log('Генерация нового Session ID')
	return crypto.randomBytes(16).toString('hex')
}

// Проверка авторизации
async function checkAuth(req: NextRequest) {
	console.log('Этап: Авторизация (checkauth)')
	const authHeader = req.headers.get('authorization')
	if (!authHeader || !authHeader.startsWith('Basic ')) {
		console.log('Ошибка: Отсутствует заголовок авторизации')
		return new Response('failure\nОтсутствует заголовок авторизации', {
			status: 401,
		})
	}

	const base64Credentials = authHeader.split(' ')[1]
	const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
	const [username, password] = credentials.split(':')

	const isValid = username === AUTH_USERNAME && password === AUTH_PASSWORD
	if (isValid) {
		const sessionId = generateSessionID()
		sessions.set(sessionId, { authorized: true })
		const responseText = `success\nPHPSESSID\n${sessionId}\n${sessionId}\n${new Date().toISOString()}`
		console.log(`Авторизация успешна, Session ID: ${sessionId}`)
		return new Response(responseText, {
			status: 200,
			headers: { 'Content-Type': 'text/plain' },
		})
	}

	console.log('Ошибка: Неверные данные для авторизации')
	return new Response('failure\nНеверные данные для авторизации', {
		status: 401,
	})
}

// Проверка действительности сессии
async function validateSession(req: NextRequest) {
	const cookie = req.headers.get('cookie')
	const sessionId = cookie?.split('PHPSESSID=')[1]
	const isValid = sessionId && sessions.has(sessionId)
	console.log(`Проверка сессии: ${isValid ? 'валидна' : 'невалидна'}`)
	return isValid
}

// Обработчик запросов POST
export async function POST(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const type = searchParams.get('type')
	const mode = searchParams.get('mode')
	const filename = searchParams.get('filename')

	// Авторизация
	if (type === 'catalog' && mode === 'checkauth') {
		console.log('Запрос: Авторизация (checkauth)')
		return await checkAuth(req)
	}

	// Валидация сессии
	if (!(await validateSession(req))) {
		console.log('Ошибка: Недействительная сессия')
		return new Response('failure\nНедействительная сессия', { status: 401 })
	}

	// Инициализация
	if (type === 'catalog' && mode === 'init') {
		console.log('Запрос: Инициализация (init)')
		return new Response(
			'zip=yes\nfile_limit=1048576000\nsessid=\nversion=3.1',
			{
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			},
		)
	}

	// Для хранения состояния загрузки
	const uploadsInProgress = new Map<string, boolean>()

	// Загрузка файла
	if (type === 'catalog' && mode === 'file' && filename) {
		console.log(`Запрос: Загрузка файла (file), Filename: ${filename}`)
		const uniqueFilename = `${Date.now()}-${filename}`
		const filePath = path.join(UPLOAD_DIR, uniqueFilename)

		// Если файл уже загружается, возвращаем 'progress'
		if (uploadsInProgress.has(filename)) {
			console.log(`Файл ${filename} еще загружается...`)
			return new Response('progress', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			})
		}

		// Устанавливаем флаг загрузки
		uploadsInProgress.set(filename, true)

		try {
			await fsPromises.mkdir(UPLOAD_DIR, { recursive: true })
			console.log(`Директория для загрузки создана: ${UPLOAD_DIR}`)
		} catch (err: Error | any) {
			console.log(`Ошибка при создании директории: ${err.message}`)
			uploadsInProgress.delete(filename)
			return new Response('failure\nОшибка при создании директории', {
				status: 500,
			})
		}

		if (req.body !== null && req.body !== undefined) {
			const reader = req.body.getReader()
			const fileStream = fs.createWriteStream(filePath, { flags: 'a' })

			try {
				console.log('Начало записи файла...')
				while (true) {
					const { done, value } = await reader.read()
					if (done) break
					fileStream.write(value)
				}
				fileStream.end()
				console.log(`Файл успешно сохранен: ${filePath}`)
			} catch (err: Error | any) {
				console.log(`Ошибка при сохранении файла: ${err.message}`)
				uploadsInProgress.delete(filename)
				return new Response('failure\nОшибка при сохранении файла', {
					status: 500,
				})
			} finally {
				// Убираем флаг загрузки
				uploadsInProgress.delete(filename)
			}

			return new Response('success', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			})
		} else {
			console.log('Ошибка: req.body is null or undefined')
			uploadsInProgress.delete(filename)
			return new Response('failure\nreq.body is null or undefined', {
				status: 400,
			})
		}
	}

	// Импорт файла
	if (type === 'catalog' && mode === 'import') {
		console.log('Запрос: Импорт файла (import)')
		return new Response('success', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' },
		})
	}

	// Завершение передачи файлов
	if (type === 'catalog' && mode === 'complete') {
		console.log('Запрос: Завершение передачи файлов (complete)')
		const timestamp = new Date()
			.toISOString()
			.replace(/[:]/g, '-')
			.split('.')[0]
		const extractDir = path.join(UPLOAD_DIR, timestamp)
		try {
			await fsPromises.mkdir(extractDir, { recursive: true })
			console.log(`Директория для разархивирования создана: ${extractDir}`)
		} catch (err: Error | any) {
			console.log(
				`Ошибка при создании директории для разархивирования: ${err.message}`,
			)
			return new Response(
				'failure\nОшибка при создании директории для разархивирования',
				{ status: 500 },
			)
		}

		// Разархивирование файлов
		const files = await fsPromises.readdir(UPLOAD_DIR)
		for (const file of files) {
			if (file.endsWith('.zip')) {
				const zipFilePath = path.join(UPLOAD_DIR, file)

				try {
					console.log(`Начало разархивирования: ${zipFilePath}`)
					await fs
						.createReadStream(zipFilePath)
						.pipe(unzipper.Extract({ path: extractDir }))
						.promise()

					await fsPromises.unlink(zipFilePath)
					console.log(`Файл успешно разархивирован и удален: ${zipFilePath}`)
				} catch (err: Error | any) {
					console.log(`Ошибка при разархивировании файла: ${err.message}`)
					return new Response('failure\nОшибка при разархивировании файла', {
						status: 500,
					})
				}
			}
		}
		// Загрузка разархивированных изображений в S3
		try {
			console.log(`Загрузка разархивированных изображений в S3: ${extractDir}`)
			await uploadExtractedImagesBatch(extractDir)
			console.log(`Изображения успешно загружены в S3`)
		} catch (err: Error | any) {
			console.log(`Ошибка при загрузке изображений в S3: ${err.message}`)
			return new Response('failure\nОшибка при загрузке изображений в S3', {
				status: 500,
			})
		}

		return new Response('success', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' },
		})
	}

	console.log('Ошибка: Неверный запрос')
	return new Response('failure\nНеверный запрос', { status: 400 })
}
