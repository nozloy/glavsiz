const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

// Пути к сертификатам
const httpsOptions = {
	key: fs.readFileSync('./certificates/privkey.pem'),
	cert: fs.readFileSync('./certificates/fullchain.pem'),
}

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	createServer(httpsOptions, (req, res) => {
		const parsedUrl = parse(req.url, true)
		handle(req, res, parsedUrl)
	}).listen(443, err => {
		if (err) throw err
		console.log('> Ready on https://localhost:443')
	})
})
