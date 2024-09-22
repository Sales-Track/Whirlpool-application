const PDV_Category = require('../models/PDV_Category.js');

async function AddObjectif(req, res) {
    try {
      const obj = await PDV_Category.create(req.body);
      res.status(200).json(obj);
    } catch (error) {
      console.error('Error Add objectif:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  async function getAllObjectif(req, res) {
    try {
      const obj = await PDV_Category.findAll();
      res.status(200).json(obj);
    } catch (error) {
      console.error('Error getting objectif:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // Fonction pour mettre à jour le champ objective
const updatePDVCategoryObjective = async (pdvId, categoryId, newObjective) => {
    try {
      const updated = await PDV_Category.update(
        { objective: newObjective },
        {
          where: {
            PDV_idPDV: pdvId,
            Category_idCategory: categoryId
          }
        }
      );
      if (updated[0] > 0) {
        console.log("Objectif mis à jour avec succès.");
      } else {
        console.log("Aucune mise à jour effectuée.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif :", error);
    }
  };
  
// Fonction pour supprimer une relation
const deletePDVCategory= async (pdvId, categoryId) => {
    try {
      const deleted = await PDV_Category.destroy({
        where: {
          PDV_idPDV: pdvId,
          Category_idCategory: categoryId
        }
      });
      if (deleted > 0) {
        console.log("objectif  supprimée avec succès.");
      } else {
        console.log("Aucune objectif trouvée à supprimer.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objectif :", error);
    }
  };
  
module.exports = {
 AddObjectif,
 getAllObjectif, 
 deletePDVCategory,
 updatePDVCategoryObjective
  };