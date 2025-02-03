const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// Create List
router.post('/', listController.createList);

// Get all Lists
router.get('/', listController.getLists);

// Get List by ID
router.get('/:id', listController.getListById);

// Update List
router.put('/:id', listController.updateList);

// Delete List
router.delete('/:id', listController.deleteList);

module.exports = router;
