const Sequelize = require('sequelize')
const connection = require('../database/database')

const User = connection.define('users', {
    
    email: {
         type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    
     }, tempToken:{
        type: Sequelize.STRING,
        allowNull: true
     }
})
//User.sync()




module.exports = User;