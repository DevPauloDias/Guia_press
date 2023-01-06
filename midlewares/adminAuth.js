function adminAuth(req, res, next){
    if(req.body.user != undefined){
        next()
    }else{
        res.redirect('/')
    }
}
module.exports = adminAuth;