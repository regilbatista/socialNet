const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const DEvents = sequelize.define("detailsevents",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  response:{
    type: Sequelize.STRING,
    allowNull: true
}


})

module.exports = DEvents;