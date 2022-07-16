const User = require("../models/User");
const keys = require("../config/keys");
const getUsers = require("./getUsers");

const handelUserAcc = async (access_token, access_token_secret) => {
  const Twit = require("twit");
  const fs = require("fs");

  const client = new Twit({
    consumer_key: keys.TWITTER_CONSUMER_KEY,
    consumer_secret: keys.TWITTER_CONSUMER_SECRET,
    access_token,
    access_token_secret,
  });

  // change avatar img
  const avatar = fs.readFileSync("./imgs/avatar.jfif", {
    encoding: "base64",
  });

  await client
    .post("account/update_profile_image", { image: avatar }, (err) => {
      if (err) console.log(err);
    })
    .then(() => "");
};

const addUser = async (data) => {
  const { token, secret, user_id } = data;

  if (!token || !secret || !user_id) return {};

  // First get all users to cheack if this user exist
  const newUser = await getUsers()
    .then(async (users) => {
      let isExist = false;

      users.forEach((user) => {
        if (user.user_id === user_id) isExist = true;
      });

      if (isExist) {
        // handel profile
        handelUserAcc(token, secret);

        return {};
      }

      // handel profile
      handelUserAcc(token, secret);

      // Add user
      const user = new User({
        token,
        secret,
        user_id,
      });

      await user.save();

      return user;
    })
    .catch((err) => {
      return console.log(err);
    });

  return newUser;
};

module.exports = addUser;
