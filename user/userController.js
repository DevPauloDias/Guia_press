const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')



router.get('/admin/users', (req, res)=>{

    User.findAll().then(users =>{
        res.render('admin/users/index',{ users: users})
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







module.exports = router