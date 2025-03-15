const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

let userId;

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      console.log(req.cookies);
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      if (!decoded) {
        return res.status(401).json({ message: "Token verification failed" });
      }
      userId = decoded.id;
      
      const user = await User.findOne({ where: { id: decoded.id } });

      if (!user) {
        return res.status(401).json({ message: "Unauthenticated" });
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Unauthenticated" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
