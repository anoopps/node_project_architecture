const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authorizeRoles = require('../middleware/authorizeRole');
// user authntication Token
const authenticateToken = require("../middleware/authenticateToken");
// integrate validate Result 
const validateRequest = require("../middleware/validateRequest");
// user controller 
const { getUsers, getUserById, createUser, userLogin, updateUser, deleteUser } = require("../controllers/userController")

// get all the user except test environtment have authentication
router.get('/', process.env.NODE_ENV === 'test' ? getUsers : [authenticateToken, authorizeRoles('admin'), getUsers])

// Get a single user
router.get('/:id', getUserById);

// create post
router.post("/",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be atleast 6 chars")

    ],
    createUser
);

// perfrom user login 
router.post("/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength().withMessage("Password length should be 6 chars")
    ],
    userLogin
);

// update the user details   
router.put("/:id",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required")
    ],
    updateUser);

// Delete a specified user   
router.delete("/:id", authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;    