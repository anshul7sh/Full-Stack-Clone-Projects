const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken)
    return res.status(401).send({ message: "You must logged In!!!" });

  const token = accessToken.replace("Bearer ", "");

  try {
    const validToken = verify(token, JWT_SECRET);
    req.user = validToken;

    if (validToken) {
      next();
    }
  } catch (error) {
    return res.status(401).send({ message: "You must logged In!!!" });
  }
};

module.exports = { validateToken };
