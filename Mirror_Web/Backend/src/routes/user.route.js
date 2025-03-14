const express = require("express");
const router = express.Router();
const { createUser,loginUser } = require("../controllers/userController");
const { protect } = require("../config/utils");

//create User
router.post("/insertuser", createUser);
router.post("/login", loginUser);

module.exports = router;
