const express = require('express');
const router = express.Router();

const PDV_Categ_Controller = require('../controllers/PDV_Categ_Controller.js');


router.post('/add',PDV_Categ_Controller.AddObjectif);
router.get('/get',PDV_Categ_Controller.getAllObjectif)
router.put('/update/:pdvId/:categoryId',PDV_Categ_Controller.updatePDVCategoryObjective)
router.delete('/del/:PDV_idPDV/:Category_idCategory',PDV_Categ_Controller.deletePDVCategory)
module.exports = router;