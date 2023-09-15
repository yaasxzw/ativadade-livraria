const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const conn = require('./db/conn')
const User = require('./models/User')
const Book = require('./models/livros')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// Rota para mostrar o formulário
app.get('/users/create', (req, res) => {
    return res.render('userAdd')
})

app.get('/books/create', (req, res) => {
    return res.render('addbook')
})

app.get('/books', async(req, res) => {
    const books = await Book.findAll({raw: true})
    return res.render('homeBook', { books })
})

// Rota para cadstrar um usuário
app.post('/users/create', async(req, res) => {
    const { name, occupation } = req.body
    let newsletter = req.body.newsletter
    
    if(newsletter === 'on'){
        newsletter = true
    }
    else{
        newsletter = false
    }

    await User.create({name, occupation, newsletter})
    return res.status(201).redirect('/')
})

app.post('/books/create', async(req, res) => {
    const { autor, titulo, preco } = req.body
    let isCapaDura = req.body.isCapaDura

    if(isCapaDura === 'on'){
        isCapaDura = true
    }
    else{
        isCapaDura = false
    }

    const bookData = {
        autor,
        titulo,
        preco,
        isCapaDura
    }

    await Book.create(bookData)
    return res.status(201).redirect('/')
})

app.get('/users/:id', async(req, res) => {
    const id = req.params.id
    const user = await User.findOne({raw: true, where: { id: id }})
    return res.render('viewUser', { user })
})

app.post('/users/delete/:id', async(req, res) => {
    const id = req.params.id
    await User.destroy({where: {id: id}})
    return res.redirect('/')
})

app.post('/books/delete/:id', async(req, res) => {
    const id = req.params.id
    await Book.destroy({where: { id: id }})
    return res.redirect('/books')
})

app.get('/books/:id', async(req, res) => {
    const id = req.params.id
    const book = await Book.findOne({raw: true, where: { id: id}})
    return res.render('viewBook', { book })
})

app.get('/users/edit/:id', async(req, res) => {
    const id = req.params.id
    const user = await User.findOne({raw: true, where: { id: id }})
    return res.render('editUser', { user: user } )
})

app.get('/books/edit/:id', async(req, res) => {
    const id = req.params.id
    const book = await Book.findOne({raw: true, where: { id: id }})
    return res.render('editBook', { book })
})

app.post('/books/edit/:id', async(req, res) => {
    const id = req.params.id
    const { autor, titulo, preco } = req.body
    let isCapaDura = req.body.isCapaDura

    if(isCapaDura === 'on'){
        isCapaDura = true
    }
    else{
        isCapaDura = false
    }

    const bookData = {
        autor,
        titulo,
        preco,
        isCapaDura
    }

    await Book.update(bookData, { where: { id: id }})
    return res.redirect('/books')
})

app.post('/users/edit/:id', async(req, res) => {
    const id = req.params.id
    const { name, occupation } = req.body
    let newsletter = req.body.newsletter

    if(newsletter === 'on'){
        newsletter = true
    }
    else{
        newsletter = false
    }
    
    const userData = {
        name,
        occupation,
        newsletter
    }

    await User.update(userData, {where: {id: id}})
    return res.redirect('/')
})

app.get('/', async(req, res) => {
    const users = await User.findAll({raw: true})
    return res.render('home', { users })
})

conn.sync()
    .then(() => {
        app.listen(3333, () => {
            console.log(`Servidor on`)
        })
    })
    .catch((err) => console.log(err))