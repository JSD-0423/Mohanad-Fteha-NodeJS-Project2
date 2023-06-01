const http = require('http')
const url = require('url')
const {
	handleGetBooks,
	handleGetBookById,
	handleCreateBook,
	handleNotFound
} = require('./handlers/bookHandler')

const server = http.createServer(async (req, res) => {
	const { pathname } = url.parse(req.url)

	if (
		req.method === 'GET' &&
		(pathname === '/books' || pathname === '/books/')
	) {
		handleGetBooks(req, res)
		return
	}

	if (req.method === 'GET' && /^\/books\/\d+$/.test(pathname)) {
		handleGetBookById(req, res, pathname)
		return
	}

	if (
		req.method === 'POST' &&
		(pathname === '/books' || pathname === '/books/')
	) {
		await handleCreateBook(req, res)
		return
	}
	handleNotFound(res)
})

server.listen(8080, () => {
	console.log('Server is running')
})
