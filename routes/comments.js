const express = require("express");
const router = express.Router();
const {createComment, getCommentsByPost} = require("../controllers/commentController");
const authenticateToken = require("../middleware/authenticateToken");


router.post("/:postId", authenticateToken, createComment);
router.get("/:postId", getCommentsByPost);

module.exports = router;