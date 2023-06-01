const Book = require('../dto/book')
const pug = require('pug')
const fs = require('fs/promises')
const { readJSONFile } = require('../utils/fileUtils')
const { StringDecoder } = require('string_decoder')

const BOOKS_FILE = 'books.json'

const handleGetBooks = (req, res) => {
	try {
		const { data: books, status } = readJSONFile(BOOKS_FILE)
		res.writeHead(status, { 'Content-Type': 'text/html' })
		res.end(pug.renderFile('./views/books.pug', { books }))
	} catch (error) {
		res.writeHead(500, { 'Content-Type': 'text/plain' })
		console.log(error)
		res.end(error.message)
	}
}

const handleGetBookById = (req, res, pathname) => {
	try {
		const id = parseInt(pathname.slice(pathname.lastIndexOf('/') + 1))

		const { data: books, status } = readJSONFile(BOOKS_FILE)

		const book = books.find(e => e.id === id)

		res.writeHead(status, { 'Content-Type': 'text/html' })
		res.end(pug.renderFile('./views/book-details.pug', { book, id }))
	} catch (error) {
		res.writeHead(500, { 'Content-Type': 'text/plain' })
		res.end(error.message)
	}
}

const handleCreateBook = async (req, res) => {
	let decoder = new StringDecoder('utf-8')
	let buffer = ''

	req.on('data', chunk => {
		buffer += decoder.write(chunk)
	})

	req.on('end', () => {
		buffer += decoder.end()
		if (buffer) {
			const data = JSON.parse(buffer)
			if (data?.id && data?.name) {
				let { id, name } = data
				if (typeof id !== 'number') {
					res.writeHead(400, { 'Content-Type': 'text/plain' })
					res.end('Id must be an integer')

					return
				}

				if (typeof name !== 'string') {
					res.writeHead(400, { 'Content-Type': 'text/plain' })
					res.end('Name must be a string')

					return
				}

				const { data: books } = readJSONFile(BOOKS_FILE)

				let isIdExist = books.find(e => e.id === id)

				if (isIdExist) {
					res.writeHead(400, { 'Content-Type': 'text/plain' })
					res.end('Sorry the id exists, please choose another id')
					return
				}

				const newBook = new Book(id, name)
				books.push(newBook)

				fs.writeFile('./data/books.json', JSON.stringify(books, 0, 3))

				res.writeHead(201, { 'Content-Type': 'text/plain' })
				res.end('Data is appended correctly')
			} else {
				res.writeHead(400, { 'Content-Type': 'text/plain' })
				res.end('name and id must be filled')

				return
			}
		}
	})
}

const handleNotFound = res => {
	res.writeHead(404, { 'Content-Type': 'text/plain' })
	res.end('404, Not Found')
}

module.exports = {
	handleGetBooks,
	handleGetBookById,
	handleCreateBook,
	handleNotFound
}
