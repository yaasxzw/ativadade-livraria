const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Book = db.define('Book', {
    autor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isCapaDura: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

module.exports = Book