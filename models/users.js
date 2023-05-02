const Sequilize = require('sequelize');

const sequelize = require("../util/database");

const Usuario = sequelize.define("usuarios",{
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type: Sequilize.STRING,
        allowNull: false
    },
    lastname:{
        type: Sequilize.STRING,
        allowNull: false
    },
    phone:{
        type: Sequilize.STRING,
        allowNull: false
    },
    img:{
        type: Sequilize.STRING,
        allowNull: false
    },
    correo:{
        type: Sequilize.STRING,
        allowNull: false,
        idexes: [{unique: true}]
    },
    usuario:{
        type: Sequilize.STRING,
        allowNull: false,
        idexes: [{unique: true}]

    },contrasena:{
        type: Sequilize.STRING,
        allowNull: false

    },estado:{
        type: Sequilize.STRING,
        allowNull: true
    }
    


})

module.exports = Usuario;