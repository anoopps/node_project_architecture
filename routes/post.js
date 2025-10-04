const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {createPost,getPostsByUser } = require("../controllers/postController");

router.post("/", authenticateToken, createPost);
router.get("/:id", authenticateToken, getPostsByUser);


module.exports = router;