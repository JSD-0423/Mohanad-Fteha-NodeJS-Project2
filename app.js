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
		res.status(500).send('Invalid book file')
	}
})

app.listen(8080, () => {
	console.log('Server is running')
})
