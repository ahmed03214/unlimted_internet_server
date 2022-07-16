const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  token: {
    required: true,
    type: String,
  },
  secret: {
    required: true,
    type: String,
  },
  user_id: {
    required: true,
    type: String,
  },
});

const User = mongoose.model("accounts", userSchema);

module.exports = User;
