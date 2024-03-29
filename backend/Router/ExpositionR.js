const express = require('express');
const router = express.Router();
const expositionController = require('../controllers/ExpoC');

// Routes pour les expositions
router.post('/expositions', expositionController.createExposition);
router.get('/expositions', expositionController.getAllExpositions);
router.get('/expositions/:id', expositionController.getExpositionById);
router.put('/expositions/:id', expositionController.updateExposition);
router.delete('/expositions/:id', expositionController.deleteExposition);
router.get('/getcategory/:pdvname/:dateCr',expositionController.getexpo);
router.get('/getwhirlpool',expositionController.WhirlpoolCount);
router.get('/other',expositionController.getOtherMarque);
router.get ('/whirlpool/:categoryname',expositionController.whirlpool)
router.get('/other/:categoryname',expositionController.getother)

module.exports = router;
