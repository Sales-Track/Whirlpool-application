const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.js');

const Presence = sequelize.define('Presence', {
    idPresence: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    datePr: DataTypes.DATE,
    checkin: DataTypes.STRING,
    checkout: DataTypes.STRING,
    position: DataTypes.STRING
  });
  
module.exports = Presence;