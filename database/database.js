const Sequelize = require('sequelize')

const connection = new Sequelize('guia_press', 'paulo','Postpaulo', {
    host: 'localhost',
    dialect: 'postgres',
    timezone: '-03:00'

})

module.exports = connection;