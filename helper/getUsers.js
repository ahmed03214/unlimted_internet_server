const User = require("../models/User");

const getUsers = async () => {
  const data = await User.find();
  const users = data.filter((data) => data);

  return users;
};

module.exports = getUsers;
