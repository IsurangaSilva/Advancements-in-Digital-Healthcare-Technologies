const mongoose = require("mongoose");
const Feedback = require("../models/feedback.model");

const createFeedback = async (req, res) => {
  try {
    const { name, feedback} = req.body;

    // Optional: Validate required fields


    const feedbackApply = new Feedback({
      name,
      feedback,
    });

    await feedbackApply.save();
    res.json({ msg: "Contact Added", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error in Feedback details", error: err.message });
  }
};

module.exports = {createFeedback};
