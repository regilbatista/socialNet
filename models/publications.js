const Sequilize = require('sequelize');

const sequelize = require("../util/database");

const Publication = sequelize.define("publicaciones",{
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    description:{
        type: Sequilize.STRING,
        allowNull: false
    },
    img:{
        type: Sequilize.STRING,
        allowNull: true
    },
    date:{
        type: Sequilize.DATE,
        allowNull: false
    }

})

module.exports = Publication;