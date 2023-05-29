const express = require('express')
const path = require('path')
const fileUtils = require('./utils/fileUtils')
const pug = require('pug')

const app = express()

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

app.listen(8080, () => {
	console.log('Server is running')
})
