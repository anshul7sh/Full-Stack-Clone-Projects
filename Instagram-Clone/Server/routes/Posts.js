const express = require("express");
const router = express.Router();

const { Posts } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/allposts", async (req, res) => {
  const allPosts = await Posts.findAll();

  try {
    res.json({ allPosts: allPosts });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/createpost", validateToken, async (req, res) => {
  const post = req.body;
  console.log(req.user);
  post.postedBy = req.user.username;
  post.UserId = req.user.id;

  await Posts.create(post);
  res.json(post);
});

router.get("/myallposts", validateToken, async (req, res) => {
  const myPosts = await Posts.findAll({ where: { UserId: req.user.id } });

  try {
    res.json({ myPosts: myPosts });
  } catch (err) {
    res.json({ err: err });
  }
});

module.exports = router;
