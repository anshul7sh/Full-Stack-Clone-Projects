const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const { validateToken } = require("../middleware/AuthMiddleware");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send({ message: "Please Fill all the details!!!" });
  }

  let isAlreasyExist = await Users.findOne({
    where: { email: email },
  });

  if (!isAlreasyExist) {
    isAlreasyExist = await Users.findOne({
      where: { username: username },
    });
  }

  try {
    if (isAlreasyExist) {
      return res
        .status(404)
        .send("User already Exist with these credentials!!!");
    }

    const newPassword = await bcrypt.hash(password, 12);
    const userToAdd = {
      username: username,
      email: email,
      password: newPassword,
    };
    try {
      await Users.create(userToAdd);

      res
        .status(200)
        .send({ message: "Successfully Posted!!!", user: userToAdd });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!", error: error });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!", error: error });
  }
});

router.post("/signin", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(422)
      .send({ message: "Please add your email or password!!!" });
  }

  const user = await Users.findOne({
    where: {
      email: email,
    },
  });
  try {
    if (!user) {
      return res.status(422).send({ message: "Invalid Credential!!!" });
    }

    const isValidLogin = await bcrypt.compare(password, user.password);
    try {
      if (!isValidLogin) {
        return res.status(422).send({ message: "Invalid Credential!!!" });
      }

      // return res.status(200).send({ message: "Login Successfully!!!" });

      const accessToken = sign(
        { username: username, email: email, id: user.id },
        JWT_SECRET
      );

      return res.status(200).send({
        token: accessToken,
        username,
        email,
        id: user.id,
        message: "Login Successfully!!!",
      });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!", error: error });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!", error: error });
  }
});

router.get("/getUser", validateToken, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
