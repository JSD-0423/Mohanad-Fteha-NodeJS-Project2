const express = require('express')
const path = require('path')
const fileUtils = require('./utils/fileUtils')
const pug = require('pug')
const Book = require('./dto/book')
const fs = require('fs/promises')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug')
app.set('views', path.resolve('./views'))

const BOOKS_FILE = 'books.json'

const validateBook = [
	check('id', `id doesn't exist`).exists(),
	check('id', `id must be an integer`).isInt(),
	check('name', `name doesn't exist`).exists()
]

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

app.post('/books', validateBook, (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() })
	}

	let { id, name } = req.body

	let newBook = new Book(id, name)

	const { data: books } = fileUtils.readJSONFile(BOOKS_FILE)

	if (books.find(e => e.id === id)) {
		res.status(400).send('Sorry the id exists, please choose another id')
		return
	}

	books.push(newBook)

	fs.writeFile('./data/books.json', JSON.stringify(books, 0, 3))
	res.status(301).send('Data is appended correctly')
})

app.get('*', (req, res) => {
	res.status(404).send('404, Not Found')
})

app.listen(8080, () => {
	console.log('Server is running')
})
