const express = require("express");
const router = express.Router();
const authorizeRoles = require('../middleware/authorizeRole'); 
const authenticateToken = require("../middleware/authenticateToken");

const userController = require("../controllers/userController")

router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getUsers
);

router.get('/:id', userController.getUserById);

router.post("/", userController.createUser);
router.post("/login", userController.userLogin);

router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;    