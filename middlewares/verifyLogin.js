const jwt = require("jsonwebtoken");

const verifyLogin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "Unauthorized Access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      req.decoded = decoded;
      console.log(decoded);
      next();
    });
  }

  module.exports = verifyLogin;