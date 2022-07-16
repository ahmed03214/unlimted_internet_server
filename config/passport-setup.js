const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const TWITTER_TOKENS = require("./keys");
const addUser = require("../helper/addUser");

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = TWITTER_TOKENS;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL:
        "https://unlimted-internet.herokuapp.com/auth/twitter/redirect",
    },
    async (token, tokenSecret, profile, done) => {
      const newUser = await addUser({
        token,
        secret: tokenSecret,
        user_id: profile._json.id_str,
      });

      if (newUser) {
        done(null, newUser);
      }
    }
  )
);
