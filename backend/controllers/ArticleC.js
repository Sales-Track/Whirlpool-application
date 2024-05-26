const Article = require('../models/Article.js');
const Category=require('../models/Category.js')
const Reference=require('../models/Reference.js')

// Create
async function createArticle(req, res) {
  try {
    const article = await Article.create( req.body );
    res.status(201).json(article);
  } catch (error) { 
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Read all
async function getAllArticles(req, res) {
  try {
    const articles = await Article.findAll();
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Read one
async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error('Error getting article by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// Get one by ref
async function getArticleByrefId(req, res) {
  try {
    const { id } = req.params;
    const article = await Article.findOne({where:{Reference_idReference:id} });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error('Error getting article by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// Update
async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { coloeur, typeC, capacite, prix } = req.body;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    await article.update({ coloeur, typeC, capacite, prix });
    res.status(200).json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete
async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    await article.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getArticlesByCategory = async (req, res) => {
  try {
    // Extraire le nom de la catégorie des paramètres de la requête
    const { categoryName } = req.params;

    // Récupérer les articles avec les références et les catégories associées
    const articles = await Article.findAll({
      include: {
        model: Reference,
        include: {
          model: Category,
          where: {
            Categoryname: categoryName,
          },
        },
      },
    });

    // Renvoyer les articles en tant que réponse JSON
    return res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);

    // Renvoyer une réponse d'erreur
    return res.status(500).json({ error: 'An error occurred while fetching articles' });
  }
};


module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticleByrefId,
  getArticlesByCategory
};
