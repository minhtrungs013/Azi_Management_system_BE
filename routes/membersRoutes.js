const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');

// CRUD Routes for Members
router.post('/', membersController.createMember); // Tạo mới Member
router.get('/', membersController.getMembers); // Lấy danh sách Members
router.get('/:projectId/non-members', membersController.getUsersNotInProject); // Lấy danh sách Members
router.get('/:id', membersController.getMemberById); // Lấy thông tin chi tiết 1 Member
router.get('/project/:projectId', membersController.getMembersByProjectId); // Lấy thông tin chi tiết 1 Member
router.put('/:id', membersController.updateMember); // Cập nhật Member
router.delete('/:id', membersController.deleteMember); // Xóa Member

module.exports = router;
