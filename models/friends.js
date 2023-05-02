const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Friends = sequelize.define("friends",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  estado:{
    type: Sequelize.STRING,
    allowNull: true
}


})

module.exports = Friends;