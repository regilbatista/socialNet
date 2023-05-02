const Sequilize = require('sequelize');

const sequelize = require("../util/database");

const Comentarie = sequelize.define("comentarios",{
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    comentarie:{
        type: Sequilize.STRING,
        allowNull: false
    }
})

module.exports = Comentarie;