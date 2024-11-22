import crypto from 'crypto'
import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { uploadExtractedImages } from '@/exchange/s3-image-upload'

const sessions = new Map()
const UPLOAD_DIR = path.resolve('./uploads')

const AUTH_USERNAME = process.env.EXCHANGE_LOGIN
const AUTH_PASSWORD = process.env.EXCHANGE_PASSWORD

// Функция генерации ID сессии
function generateSessionID() {
	return crypto.randomBytes(16).toString('hex')
}

// Проверка авторизации
async function checkAuth(req) {
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
async function validateSession(req) {
	const cookie = req.headers.get('cookie')
	const sessionId = cookie?.split('PHPSESSID=')[1]
	const isValid = sessionId && sessions.has(sessionId)
	console.log(`Проверка сессии: ${isValid ? 'валидна' : 'невалидна'}`)
	return isValid
}

// Обработчик запросов POST
export async function POST(req) {
	const { searchParams } = new URL(req.url)
	const type = searchParams.get('type')
	const mode = searchParams.get('mode')
	const filename = searchParams.get('filename')

	// Авторизация
	if (type === 'catalog' && mode === 'checkauth') {
		return await checkAuth(req)
	}

	// Валидация сессии
	if (!(await validateSession(req))) {
		console.log('Ошибка: Недействительная сессия')
		return new Response('failure\nНедействительная сессия', { status: 401 })
	}

	// Инициализация
	if (type === 'catalog' && mode === 'init') {
		console.log('Этап: Инициализация (init)')
		return new Response(
			'zip=yes\nfile_limit=1048576000\nsessid=your_session_id\nversion=3.1',
			{
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			},
		)
	}

	// Загрузка файла
	if (type === 'catalog' && mode === 'file' && filename) {
		console.log(`Этап: Загрузка файла (file), Filename: ${filename}`)
		const uniqueFilename = `${Date.now()}-${filename}`
		const filePath = path.join(UPLOAD_DIR, uniqueFilename)

		try {
			await fsPromises.mkdir(UPLOAD_DIR, { recursive: true })
			console.log(`Директория для загрузки создана: ${UPLOAD_DIR}`)
		} catch (err) {
			console.log(`Ошибка при создании директории: ${err.message}`)
			return new Response('failure\nОшибка при создании директории', {
				status: 500,
			})
		}

		const reader = req.body.getReader()
		const fileStream = fs.createWriteStream(filePath, { flags: 'a' })

		try {
			while (true) {
				const { done, value } = await reader.read()
				if (done) break
				fileStream.write(value)
			}
			fileStream.end()
			console.log(`Файл успешно сохранен: ${filePath}`)
		} catch (err) {
			console.log(`Ошибка при сохранении файла: ${err.message}`)
			return new Response('failure\nОшибка при сохранении файла', {
				status: 500,
			})
		}

		return new Response('success', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' },
		})
	}

	// Импорт файла
	if (type === 'catalog' && mode === 'import') {
		console.log('Этап: Импорт файла (import)')
		return new Response('success', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' },
		})
	}

	// Завершение передачи файлов
	if (type === 'catalog' && mode === 'complete') {
		console.log('Этап: Завершение передачи файлов (complete)')
		const timestamp = new Date()
			.toISOString()
			.replace(/[:]/g, '-')
			.split('.')[0]
		const extractDir = path.join(UPLOAD_DIR, timestamp)

		try {
			await fsPromises.mkdir(extractDir, { recursive: true })
			console.log(`Директория для разархивирования создана: ${extractDir}`)
		} catch (err) {
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
					console.log(`Разархивирование файла: ${zipFilePath}`)
					await fs
						.createReadStream(zipFilePath)
						.pipe(unzipper.Extract({ path: extractDir }))
						.promise()

					await fsPromises.unlink(zipFilePath)
					console.log(`Файл успешно разархивирован и удален: ${zipFilePath}`)
				} catch (err) {
					console.log(`Ошибка при разархивировании файла: ${err.message}`)
					return new Response('failure\nОшибка при разархивировании файла', {
						status: 500,
					})
				}
			}
		}

		// Загрузка разархивированных изображений в S3
		await uploadExtractedImages(extractDir)

		return new Response('success', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' },
		})
	}

	console.log('Ошибка: Неверный запрос')
	return new Response('failure\nНеверный запрос', { status: 400 })
}
