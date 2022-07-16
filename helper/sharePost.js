const Twitter = require("twitter");
const keys = require("../config/keys");

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = keys;

const getRandomMessage = () => {
  const messages = [
    "النت مش ترفيه وبس ممكن يكون شغل وتعليم .. اما انتو",
    "شدو حيلكم نقوم الهاش التاني كمان",
    "اصوت يعلوا فوق صوت الهاشتاج بس ياريت يقدروا اصوات",
    "كفاية سرقة",
    "شبيك لبيك نفسك في إيه يا مصطفى نفسي في إنترنت غير",
    "مطلب شعب",
    "هفضل لوحدي هحايا رب برضو",
    "شحن الباقة يوم 10 تخلص نصها يوم 13 ازاي ؟",
    "انا شايف أن الكل ياجل دفع اشتراك الارضي علي الاقل",
    "كان يوم أسود لما دخلنا الخط الأرضي و ركبنا النت",
    "we will not stop supporting the idea. We demand un",
    "اللي يعمل ريتويت يكتب اي كلام ويكتب الهاشتاج تاني",
    "مكملين",
    "انا مش هكلم هي قربت اوي يارجاله وياريت تدخلو معانا",
    "يارب نقدر",
    "احنا الدوله الوحيده الي كل م الوقت بيعدي بترجع لور",
    "تسقط الباقه",
    "عايزين دة عشان نقضي على المحتوى المقرصن",
    "عايزين دة عشان نشجع شبابنا يشتغلوا أونلاين",
    "عايزين دة عشان نشترك في خدمات ستريمنج",
    "عايزين دة عشان دة اللي مصر تستحقه",
  ];

  const randomMessage =
    messages[Math.ceil(Math.random() * messages.length - 1)];

  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomWord = "";

  for (var i = 0; i < 5; i++) {
    randomWord += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  const hashs =
    "#انترنت_لا_محدود_في_مصر #انترنت_غير_محدود_في_مصر  #انترنت_غير_محدود_ف_مصر #مقاطعة_وي";

  const mentions = "@telecomegypt";

  const message = `${randomMessage}\n\n${hashs}\n${mentions}\n${randomWord}`;

  return message;
};

const getImgOrNot = async (client) => {
  const isWithImg = Math.ceil(Math.random() * 10) > 5 ? true : false;

  if (isWithImg) {
    const getRandomImgPath = () => {
      const IMG_NUM = 10;
      const randomIndex = Math.ceil(Math.random() * IMG_NUM);

      return `./imgs/img00${randomIndex}.png`;
    };

    const media = require("fs").readFileSync(getRandomImgPath());

    return new Promise((res) => {
      client.post("media/upload", { media }, (err, media) => {
        if (err) return console.log(err);

        res({ media_ids: media.media_id_string });
      });
    });
  } else {
    return {};
  }
};

const sharePost = ({ key, secret, num = 1 }) => {
  if (!key || !secret || !num) {
    console.log("minus argument");
  }

  const post = async ({ access_token_key, access_token_secret, num }) => {
    const client = new Twitter({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      // user
      access_token_key,
      access_token_secret,
    });

    for (let i = 0; i < num; i++) {
      setTimeout(async () => {
        const mediaId = await getImgOrNot(client).then((data) => data);

        const status = {
          status: getRandomMessage(),
          ...mediaId,
        };

        client.post("statuses/update", status, (err) => {
          if (err) return console.log(err);
        });
      }, 1200);
    }
  };

  // carete post
  post({
    access_token_key: key,
    access_token_secret: secret,
    num,
  });
};

module.exports = sharePost;
