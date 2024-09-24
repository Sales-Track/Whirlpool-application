const Marque = require('../models/Marque.js');

// Create
async function createMarque(req, res) {
  try {
    const { marquename } = req.body;
    const marque = await Marque.create({ marquename });
    res.status(201).json(marque);
  } catch (error) {
    console.error('Error creating marque:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Read all
async function getAllMarques(req, res) {
  try {
    const marques = await Marque.findAll();
    res.status(200).json(marques);
  } catch (error) {
    console.error('Error getting marques:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Read one
async function getMarqueById(req, res) {
  try {
    const { id } = req.params;
    const marque = await Marque.findByPk(id);
    if (!marque) {
      return res.status(404).json({ message: 'Marque not found' });
    }
    res.status(200).json(marque);
  } catch (error) {
    console.error('Error getting marque by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update
async function updateMarque(req, res) {
  try {
    const { id } = req.params;
    const { marquename } = req.body;
    const marque = await Marque.findByPk(id);
    if (!marque) {
      return res.status(404).json({ message: 'Marque not found' });
    }
    await marque.update({ marquename });
    res.status(200).json(marque);
  } catch (error) {
    console.error('Error updating marque:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete
async function deleteMarque(req, res) {
  try {
    const { id } = req.params;
    const marque = await Marque.findByPk(id);
    if (!marque) {
      return res.status(404).json({ message: 'Marque not found' });
    }
    await marque.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting marque:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// const getidbyname =(req,res)=>{
//     try{
//         const name=req.params.name;
//         const result=Marque.findOne( { where : { marquename : name } })
//         res.json(result.idMarque)
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).send("erreur")
//     }
// }
const getnamebyid=async(req,res)=>{
  try{
    const { idmarque }=req.params
    const marque=await Marque.findByPk(idmarque)
    res.status(200).json(marque);

  }   
  catch(err){
        console.error(err);
        res.status(500).send("erreur")
    }
}
const { Op } = require('sequelize'); // Importer l'opérateur Sequelize

const getIdWhirlpool = async (req, res) => {
  try {
    const marque = await Marque.findOne({
      where: {
        marquename: {
          [Op.in]: ["WHIRLPOOL", "Whirlpool", "whirlpool"] // Liste des valeurs
        }
      }
    });

    if (marque) {
      res.status(200).json(marque.idMarque);
    } else {
      res.status(404).send("Marque non trouvée");
    }
  } catch (err) {
    console.error(err); // Assurez-vous que l'erreur est bien "err"
    res.status(500).send("Erreur serveur");
  }
}


module.exports = {
  createMarque,
  getAllMarques,
  getMarqueById,
  updateMarque,
  deleteMarque,
  getnamebyid,
  getIdWhirlpool
};
