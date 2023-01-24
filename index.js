const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const cors = require('cors')
const port = process.env.PORT || 3000

var session = require('express-session')

// import Controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/articlesController') 
// userController
const usersController = require('./user/userController')

 //import  Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')

app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// database
connection.authenticate().then(()=>{
    console.log(' conexão feita com sucesso')
}).catch((erro)=>{
    console.log('erro de conexão:' + erro)
})

//session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)


app.use(express.static('public'))



app.get('/', (req, res)=>{
    
    Article.findAll({
        order: [
            ['id','DESC']
        ], 
        limit: 3
    
    }).then(articles =>{
        Category.findAll().then(categories => {
            res.render('index', { articles : articles, categories: categories})
        })

       
    }).catch(erro =>{
        console.log('falha ao buscar os dados'+ erro)
    })
})

app.get('/:slug', (req, res)=>{

    var slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article=>{
        if (article != undefined){
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories})
            })
           
        }else{
            res.redirect('/')
        }        

    }).catch(erro =>{
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }). then(category => {
        if(category != undefined){
            Category.findAll().then( categories => {
                res.render('index', { articles: category.articles, categories: categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })

})


app.listen(port,()=>{
    console.log('O servidor está rodando')
})