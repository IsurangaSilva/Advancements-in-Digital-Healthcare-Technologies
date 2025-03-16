const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

//Create A New Sellar
const createUser = async (req, res) => {
  const { username , email, password , phone , role  } = req.body;

  try {
    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Secure Password With Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    res.json({ newUser, msg: "User Successfully Registered!", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  };
}

//Login Function
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Email:",email)
      console.log("Password:",password)
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid Email or User not Found' });
      }
      // Check if password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

     // Generate JWT token
     const token = jwt.sign({ user: user._id },"6Jc9da8Kfpx2YLSSeI6UJwp8q5EObZwcMfboV2uS1jxEZyDhaT3HFXNKm4et0dq" ,{ expiresIn: '1h' });
      res.status(200).json({
        message: 'Login successful',
        userId: user._id,
        role: user.role,
        token: `Bearer ${token}`
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
   }
  };

module.exports = { createUser ,loginUser};