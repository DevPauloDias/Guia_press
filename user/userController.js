const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../midlewares/adminAuth')
const { default: axios } = require('axios')




router.get('/admin/users',(req, res)=>{
    console.log('passei aq')
    User.findAll().then(users =>{
        if(users != undefined){
            res.render('admin/users/index',{users: users})
        }else{
            res.redirect('/')
            console.log('nenhum usuario encontrado')
        }
       
    }).catch(err =>{
        res.send('erro na consulta. erro: '+ err)
    })
})    


router.get('/admin/users/create', (req, res)=>{
    res.render('admin/users/create')
})

router.post('/users/create', (req, res)=>{
    var email = req.body.email
    var password = req.body.password


    User.findOne({ where:{ email: email } }).then( user=> {

        if(user != undefined){

            console.log('email já está em uso!')
            res.redirect('/admin/users/create')
        }else{

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)  

            User.create({

                email: email,
                password: hash        

            }).then(()=>{
               res.redirect('/')
         
            console.log('usuario cadastrado com sucesso')

            }).catch(err =>{

                console.log('erro ao cadatrar usuario' + err)
            })
        }        
    })    

})
router.get('/login', (req, res)=>{

    res.render('admin/users/login')
})

router.post('/authenticate', (req, res)=>{
    var email = req.body.email
    var password = req.body.password
    var sub = req.body.sub



    User.findOne({where:{email: email }
    }).then(user =>{
        if( user != undefined){

            if(sub != undefined && sub != ''){

                req.session.user= {
                    id: user.id,
                    email: user.email                                      

                }
                console.log(  'Esse usuario logou com o google')

                try{
                    console.log(' redirecionou - verifica aii')

                    res.redirect('/admin/categories')

                   

                }catch(err){

                    console.log(' não foi possivel redirecionar' + err)

                }
                
                
                

                
                return

            }

          var correct = bcrypt.compareSync(password, user.password)  

          if(correct){
                req.session.user= {
                    id: user.id,
                    email: user.email

                }
                console.log('autenticado com sucesso')
                res.redirect('/admin/articles')

            }else{
                res.redirect('/login')
            }
        
        }else if(sub != undefined && sub != ''){
            
           

            axios.post('http://localhost:3333/users/create', {email: email, password: '123'})


        }else{
            res.redirect('/login')
        }

    })

})


router.get('/logout', (req, res)=>{
    req.session.user = undefined;
    res.redirect('/')
})


0
module.exports = router