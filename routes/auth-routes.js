const router = require("express").Router();
const passport = require("passport");

// helper
const sharePost = require("../helper/sharePost");
const CLIENT_HOME_PAGE_URL = "https://unlimted-internet.vercel.app";

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// Share post
router.get("/sharePost", (_, res) => {
  const { key, secret, num } = res.req.query;

  //
  if (!key || !secret || !num) {
    res.send("faild");
  }

  // carete post
  sharePost({
    key: key,
    secret: secret,
    num: num,
  });

  res.send({
    code: 200,
    message: `success share ${num} post${num > 1 ? "s" : ""}`,
  });
});

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: `${CLIENT_HOME_PAGE_URL}?success=1`,
    failureRedirect: "/auth/login/failed",
  })
);

module.exports = router;
