const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.js');


const PDV_Category = sequelize.define('PDV_Category', {
  PDV_idPDV: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PDVs', // Nom du modèle PDV
      key: 'idPDV',
    },
  },
  Category_idCategory: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories', // Nom du modèle Category
      key: 'idCategory',
    },
  },
  objective: {
    type: DataTypes.STRING,
    allowNull: true, // Tu peux ajuster cela si tu souhaites que ce champ soit obligatoire
  },
});

module.exports = PDV_Category;
