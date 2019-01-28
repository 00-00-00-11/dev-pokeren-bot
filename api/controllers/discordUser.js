const DiscordUser = require("../../models/discordUser");

// GET /discordUser
exports.discordUser_get_all = (req, res, next) => {
  DiscordUser.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        all_users: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// GET /discordUser/:userId
exports.discordUser_get_user = (req, res, next) => {
  const userId = req.params.userId;
  DiscordUser.find({ user_id: userId })
    .exec()
    .then(doc => {
      res.status(200).json({
        user: doc
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
