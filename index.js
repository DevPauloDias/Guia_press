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



app.get('/', (req, res)=>{
    
    Article.findAll({
        order: [
            ['id','DESC']
        ]
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


app.listen(3333,()=>{
    console.log('O servidor está rodando')
})