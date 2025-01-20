const config = require("../config/config");
const jwt = require("jsonwebtoken");

const verifyJwt = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtTokenSecret);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = verifyJwt;
