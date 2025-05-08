const express = require('express');
const router = express.Router();
const areaController = require('../controllers/admin/areaController');

router.route('/').post(areaController.createArea).get(areaController.getAllAreas);

router
  .route('/:id')
  .get(areaController.getAreaById)
  .put(areaController.updateArea)
  .delete(areaController.deleteArea);

module.exports = router;
