const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const userController = require("../controllers/userController");


const router = express.Router();

router.post(
    "/",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    ],
    validateRequest,
    userController.createUser
);


module.exports = router;