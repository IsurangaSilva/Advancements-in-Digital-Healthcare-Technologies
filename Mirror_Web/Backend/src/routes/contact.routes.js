const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/contact.controller");

router.post("/createContact", createContact);

module.exports = router;
