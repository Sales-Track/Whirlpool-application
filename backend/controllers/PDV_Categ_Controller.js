const PDV_Category = require('../models/PDV_Category.js');

async function AddObjectif(req, res) {
    try {
      const obj = await PDV_Category.create(req.body);
      res.status(201).json(obj);
    } catch (error) {
      console.error('Error Add objectif:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // async function getAllObjectif(req, res) {
  //   try {
  //     const obj = await PDV_Category.findAll();
  //     res.status(200).json(obj);
  //   } catch (error) {
  //     console.error('Error getting objectif:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // }
  // Fonction pour mettre à jour le champ objective
  const updatePDVCategoryObjective = async (req, res) => {
    const { PDV_idPDV, Category_idCategory } = req.params;
    const { objective } = req.body;
  
    try {
      const updated = await PDV_Category.update(
        { objective: objective },
        {
          where: {
            PDV_idPDV:PDV_idPDV,
            Category_idCategory: Category_idCategory,
          },
        }
      );
  
      if (updated[0] > 0) {
        res.status(200).json({ message: 'Objectif mis à jour avec succès.' });
      } else {
        res.status(404).json({ message: 'Aucune mise à jour effectuée.' });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif :", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getAllObjectif = async (req, res) => {
    try {
      const obj = await PDV_Category.findAll();
      res.status(200).json(obj);
    } catch (error) {
      console.error('Error getting objectif:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  // Supprimer une relation
  const deletePDVCategory = async (req, res) => {
    const { PDV_idPDV, Category_idCategory  } = req.params;
  
    try {
      const deleted = await PDV_Category.destroy({
        where: {
          PDV_idPDV: PDV_idPDV,
          Category_idCategory: Category_idCategory,
        },
      });
  
      if (deleted > 0) {
        res.status(200).json({ message: 'Objectif supprimé avec succès.' });
      } else {
        res.status(404).json({ message: 'Aucune objectif trouvée à supprimer.' });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objectif :", error);
      res.status(500).json({ message: 'Internal server error' });
    }

  };
  
  
  
module.exports = {
 AddObjectif,
 getAllObjectif, 
 deletePDVCategory,
 updatePDVCategoryObjective,
 getAllObjectif
  };