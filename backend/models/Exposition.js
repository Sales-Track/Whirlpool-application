const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.js');

const Exposition = sequelize.define('Exposition', {
    idExpo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dateCr: DataTypes.STRING,
    prix: DataTypes.INTEGER

  });

  module.exports = Exposition;
  