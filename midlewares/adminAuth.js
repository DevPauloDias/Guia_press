function adminAuth(req, res, next){
    if(req.body.user != undefined){
        next()
    }else{
        res.redirect('/login')
    }
}
module.exports = adminAuth;