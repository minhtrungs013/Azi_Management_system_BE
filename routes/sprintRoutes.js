const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprintController');

router.post('/', sprintController.createSprint);
router.get('/:projectId', sprintController.getAllSprints);
router.get('/detail/:sprintId', sprintController.getSprintById);
router.put('/:sprintId', sprintController.updateSprint);
router.delete('/:sprintId', sprintController.deleteSprint);

module.exports = router;
