const mongoose = require("mongoose");
const Contact = require("../models/contact.model");

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Optional: Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const contactApply = new Contact({
      name,
      email,
      message,
    });

    await contactApply.save();
    res.json({ msg: "Contact Added", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error registering contact details", error: err.message });
  }
};

module.exports = { createContact };
