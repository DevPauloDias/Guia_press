const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

// import Controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/articlesController') 

 //import  Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// database
connection.authenticate().then(()=>{
    console.log(' conexão feita com sucesso')
}).catch((erro)=>{
    console.log('erro de conexão:' + erro)
})

app.use('/', categoriesController)
app.use('/', articlesController)


app.use(express.static('public'))


app.listen(3333,()=>{
    console.log('O servidor está rodando')
})