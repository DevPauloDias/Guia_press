const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../midlewares/adminAuth')




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
                pssword: hash        

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

    User.findOne({where:{email: email }
    }).then(user =>{
        if( user != undefined){
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
        
        }else{
            res.redirect('/login')
        }

    })

})
router.post('/login', (req, res)=>{
    console.log(req.data)

  


 var correct = false;
    // lógica aq
    if(correct){
        req.session.user= {
            id: 50,
            email: "testePaulo"

        }
        console.log('autenticado com sucesso')
        res.redirect('/admin/articles')

    }else{
        res.redirect('/login')
    }

})

router.get('/logout', (req, res)=>{
    req.session.user = undefined;
    res.redirect('/')
})


0
module.exports = router