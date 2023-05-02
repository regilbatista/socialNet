const Sequilize = require('sequelize');

const sequelize = require("../util/database");

const Reply = sequelize.define("repuestas",{
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    reply:{
        type: Sequilize.STRING,
        allowNull: false
    }
})

module.exports = Reply;