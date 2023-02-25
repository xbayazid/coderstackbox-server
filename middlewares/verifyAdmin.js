const User = require("../model/UserSchema");

const verifyAdmin = async (req, res, next) => {
    const decodedEmail = req.query.email;
    // console.log(decodedEmail);
    const query = { email: decodedEmail };
    const user = await User.findOne(query);
    // console.log(user);
    if (user?.role !== "admin") {
      return res.status(403).send({ message: "forbidden access" });
    }
    next();
  };

module.exports = verifyAdmin;