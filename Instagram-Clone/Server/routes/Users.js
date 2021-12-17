const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send({ message: "Please Fill all the details!!!" });
  }

  const isAlreasyExist = await Users.findOne({
    where: { email: email },
  });

  if (isAlreasyExist) {
    return res.status(404).send("User already Exist with this email!!!");
  }

  const newPassword = await bcrypt.hash(password, 12);
  const userToAdd = {
    username: username,
    email: email,
    password: newPassword,
  };

  await Users.create(userToAdd);

  res.status(200).send({ message: "Successfully Posted!!!", user: userToAdd });
});

module.exports = router;
