function adminAuth(req, res, next){
    
    if(req.session.user != undefined){
        console.log(' sessão iniciada com sucesso')
        next()
    }else{
        res.redirect('/login')
        console.log(' sessão nao iniciada')
    }
}
module.exports = adminAuth;