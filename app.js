const express = require('express')
const path = require('path')
const fileUtils = require('./utils/fileUtils')
const pug = require('pug')
const Book = require('./dto/book')
const fs = require('fs/promises')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json({}))
app.set('view engine', 'pug')
app.set('views', path.resolve('./views'))

const BOOKS_FILE = 'books.json'

app.get('/books', (req, res) => {
	try {
		const { data: books, status } = fileUtils.readJSONFile(BOOKS_FILE)
		res.status(status).render('books', { books })
	} catch (error) {
		res.status(500).send(error.message)
	}
})

app.get('/books/:id', (req, res) => {
	try {
		const id = parseInt(req.params.id)
		if (isNaN(id) || !Number.isInteger(id)) {
			res.status(400).send('Invalid ID parameter. It must be an integer')
			return
		}

		const { data: books, status } = fileUtils.readJSONFile(BOOKS_FILE)

		const book = books.find(e => e.id === id)
		res.status(status).render('book-details', { book, id })
	} catch (error) {
		res.status(500).send(error.message)
	}
})

app.post('/books', (req, res) => {
	res.setHeader('Content-type', 'application/json')

	if (!req.body) {
		res.status(400).send('There is no data to add')
		return
	}
	let { id, name } = req.body

	if (!id || !name) {
		res.status(400).send('(id, name) must be filled')
		return
	}

	let newBook = new Book(id, name)

	const { data: books } = fileUtils.readJSONFile(BOOKS_FILE)

	if (books.find(e => e.id === id)) {
		res.status(400).send('Sorry the id exists, please choose another id')
		return
	}

	books.push(newBook)

	fs.writeFile('./data/books.json', JSON.stringify(books))
	res.status(301).send('Data is appended correctly')
})

app.listen(8080, () => {
	console.log('Server is running')
})
