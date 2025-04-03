const express = require('express');
const router = express.Router();

const addOnsController = require('../controllers/admin/addOnsController');
const { protect } = require('../middlewares/authmiddlewares');
const upload = require('../utilities/multer');

router.use(protect);
router
  .route('/')
  .get(addOnsController.getAddOns)
  .post(upload('addOns', true), addOnsController.createAddOns);

router
  .route('/:id')
  .get(addOnsController.getAddOnById)
  .delete(addOnsController.deleteAddOn)
  .patch(upload('addOns', true), addOnsController.updateAddOn);

module.exports = router;
