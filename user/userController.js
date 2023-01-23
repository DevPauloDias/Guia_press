const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../midlewares/adminAuth')
const { default: axios } = require('axios')
const nodemailer = require('nodemailer')
const { application } = require('express')




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

            var salt = bcrypt.genSalt(10)
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

router.post('/authenticate',async(req, res)=>{
    var email = req.body.email
    var password = req.body.password
    var sub = req.body.sub


 
   await User.findOne({where:{email: email }
    }).then(user =>{
        if( user != undefined){

            if(sub != undefined && sub != ''){

                req.session.user= {
                    id: user.id,
                    email: user.email                                      

                }
                console.log(  'Esse usuario logou com o google')

                try{
                    

                    res.redirect('/admin/categories')

                    return

                }catch(err){

                    console.log(' não foi possivel redirecionar' + err)
                    return

                }                
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
                console.log('erro no login')
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

router.get('/verify-user-email/:email', async(req, res)=>{
    let email = req.params.email

    let user= await User.findOne({ where: {email: email}}).then(user=>{
        console.log(user.id)
        return user
    }).catch(err =>{ console.log('Email não localizado na base de dados!', err)})

  if(user != undefined){
        res.status(200)
        res.send()
        let token  = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2)
        console.log(token);
        var salt = bcrypt.genSaltSync(10);
        
        let hash = bcrypt.hashSync(token,salt)
        // Inserir o token criptografado no banco de dados

       await User.update({tempToken: hash}, {where: { id: user.id}}).then(()=>{
            console.log(' Token do usuario inserido no banco')
        }).catch(err=> {
            console.log('Não foi possível salvar o token!')
            console.log(err)
        })



        //

        let link = `http://localhost:3333/reset-user-password/${user.id}/${token}`
        // Enviar o email para o usuario    

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: "paulovitorsouza99@gmail.com", // generated ethereal user
            pass:"wfwkokmfvenlmzxt" , // generated ethereal password
            },
        });

        (async function sendEmail(){
            let info = await transporter.sendMail({
                from: 'paulovitorsouza99@gmail.com', // sender address
                to: "securynet2017@gmail.com", // list of receivers
                subject: "Reset password", // Subject line
                text: "Acces the link bellow to reset your password", // plain text body
                html: `<h2> Click in the link bellow to reset your password  </h2> <br>
                    <p> ${link} </p>`, // html body
            });
        
            })();

        

        //
        res.status(200)
        res.send()

    }else{ 
        res.status(400)
        res.send()
    }
})

router.get("/reset-user-password/:id/:token",(req, res)=>{
    let userId= req.params.id;
    let token = req.params.token;
    let userData={
        id: userId,
        token: token
    }

    res.render('admin/users/reset-password.ejs',{userData: userData})
})

router.post('/reset-user-password', async(req,res)=>{

    let token = req.body.token
    let id = req.body.id
    let password = req.body.password

    if( token != '' && id != ''&& password != ''){

            let user = await User.findByPk(id).then( user =>{
                console.log(user.tempToken)
                return user;
            }).catch(err =>{
                console.log(err)
            })
            
            if (user != undefined){
                let salt= bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(password, salt)
                
                let correct = bcrypt.compareSync(token, user.tempToken)

                if(correct){
                    User.update({password: hash},{ where:{id: id}})
                }
                res.status(200)                
                res.redirect('/login')
            }else{
                console.log('Usuario com undefined')
                res.status(404)
                res.send()
            }
    }
    
})

// teste push de main
// rota para envio de email aqui
module.exports = router