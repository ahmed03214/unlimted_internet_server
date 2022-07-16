const getUsers = require("./getUsers");
const sharePost = require("./sharePost");
var cron = require("node-cron");

const sharePosts = async () => {
  const res = await getUsers()
    .then((users) => {
      users.map((user) => {
        const { token: key, secret } = user;

        const randomTimeOut = () => {
          const randomN = Math.floor(Math.random() * (10 - 6 + 1)) + 6;

          return randomN + "000";
        };

        setTimeout(() => sharePost({ key, secret }), randomTimeOut());
      });

      return { code: 200, message: "success", num: users?.length || 0 };
    })
    .catch((err) => {
      console.log(err);
      return { code: 400, message: "faild" };
    });

  return res;
};

cron.schedule("*/30 * * * * *", () => {
  sharePosts()
    .then((data) => {
      if (data.code === 200) {
        console.log(`${data.num} posts added to account tasked`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = sharePosts;
