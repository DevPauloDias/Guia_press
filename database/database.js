const Sequelize = require('sequelize')

const connection = new Sequelize('guia_press', 'postgres','dwpq2jnza4', {
    host: 'localhost',
    dialect: 'postgres',
    timezone: '-03:00'

})

module.exports = connection;