const Exposition = require('../models/Exposition.js');
const Sequelize = require('sequelize');
const Article = require('./ArticleC.js');
const Reference = require('./RefC.js');
const Marque = require('./MarqueC.js');
const PDV = require('./PdvC.js'); // Assuming you have a PDV model
const Category = require('./CategoryC.js'); // Assuming you have a Category model

// Create
async function createExposition(req, res) {
  try {
    const exposition = await Exposition.create(req.body);
    res.status(201).json(exposition);
  } catch (error) {
    console.error('Error creating exposition:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Read all
async function getAllExpositions(req, res) {
  try {
    const expositions = await Exposition.findAll();
    res.status(200).json(expositions);
  } catch (error) {
    console.error('Error getting expositions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Read one
async function getExpositionById(req, res) {
  try {
    const { id } = req.params;
    const exposition = await Exposition.findByPk(id);
    if (!exposition) {
      return res.status(404).json({ message: 'Exposition not found' });
    }
    res.status(200).json(exposition);
  } catch (error) {
    console.error('Error getting exposition by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update
async function updateExposition(req, res) {
  try {
    const { id } = req.params;
    const { dateCr } = req.body;
    const exposition = await Exposition.findByPk(id);
    if (!exposition) {
      return res.status(404).json({ message: 'Exposition not found' });
    }
    await exposition.update({ dateCr });
    res.status(200).json(exposition);
  } catch (error) {
    console.error('Error updating exposition:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete
async function deleteExposition(req, res) {
  try {
    const { id } = req.params;
    const exposition = await Exposition.findByPk(id);
    if (!exposition) {
      return res.status(404).json({ message: 'Exposition not found' });
    }
    await exposition.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting exposition:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get expositions by PDV name and date creation
async function getexpo(req, res) {
  try {
    const data = await Exposition.findAll({
      include: [
        {
          model: PDV,
          where: { pdvname: req.params.pdvname },
          include: [
            {
              model: Article,
              include: [
                {
                  model: Reference,
                  include: [
                    {
                      model: Category,
                      where: { categoryname: req.params.categoryname }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      where: { dateCr: req.params.dateCr }
    });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get count of Whirlpool articles
async function WhirlpoolCount(req, res) {
  try {
    const whirl = await Article.findAndCountAll({
      include: [
        {
          model: Reference,
          include: [
            {
              model: Marque,
              where: { marquename: 'Whirlpool' }
            }
          ]
        },
        {
          model: Exposition,
          include: [
            {
              model: PDV
            }
          ]
        }
      ]
    });

    res.status(200).json({ message: "Nombre d'articles Whirlpool exposés dans les points de vente:", count: whirl.count });
  } catch (err) {
    console.error('Erreur lors de la recherche:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get count of articles by other marques
async function getOtherMarque(req, res) {
  try {
    const other = await Marque.count({
      include: [
        {
          model: Reference,
          include: [
            {
              model: Article,
              include: [
                {
                  model: Exposition,
                  include: [
                    {
                      model: PDV
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      where: {
        marquename: {
          [Sequelize.Op.ne]: 'Whirlpool'
        }
      }
    });
    res.status(200).json({ message: 'Les autres marques', count: other });
  } catch (err) {
    console.error('Erreur lors du comptage des enregistrements:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get articles with certain conditions
async function getother(req, res) {
  try {
    const result = await Article.findAll({
      attributes: [
        [sequelize.col('Marque.marquename'), 'marque'],
        [sequelize.col('Reference.refferencename'), 'reference'],
        [sequelize.col('Article.prix'), 'prix'],
        [sequelize.col('Category.categoryname'), 'category']
      ],
      include: [
        {
          model: Reference,
          include: [
            {
              model: Marque,
              where: { marquename: { [Sequelize.Op.not]: 'Whirlpool' } }
            },
            {
              model: Category,
              where: { categoryname: req.params.categoryname }
            }
          ]
        }
      ]
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get Whirlpool articles by category name
async function whirlpool(req, res) {
  try {
    const result = await Article.findAll({
      attributes: [
        [sequelize.col('Marque.marquename'), 'marque'],
        [sequelize.col('Reference.refferencename'), 'reference'],
        [sequelize.col('Article.prix'), 'prix'],
        [sequelize.col('Category.categoryname'), 'category']
      ],
      include: [
        {
          model: Reference,
          include: [
            {
              model: Marque,
              where: { marquename: 'Whirlpool' }
            },
            {
              model: Category,
              where: { categoryname: req.params.categoryname }
            }
          ]
        }
      ]
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  whirlpool,
  getother,
  getOtherMarque,
  WhirlpoolCount,
  getexpo,
  createExposition,
  getAllExpositions,
  getExpositionById,
  updateExposition,
  deleteExposition
};
