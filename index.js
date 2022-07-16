require("dotenv").config();
require("./helper/sharePosts")
const session = require("cookie-session");
const express = require("express");
const app = express();
const port = 3000;
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const cors = require("cors");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser"); // parse cookie header
const passportSetup = require("./config/passport-setup");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

mongoose
  .connect(keys.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log(err);
  });

// parse cookies
app.use(cookieParser());

app.use(
  session({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000, // session will expire after 24 hours
    secret: "keyboard cat",
  })
);

// initalize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "https://unlimted-internet.vercel.app", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// set up routes
app.use("/auth", authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});

// connect react to nodejs express server
app.listen(process.env.PORT || port, () => console.log(`Server is running on port ${port}!`));
