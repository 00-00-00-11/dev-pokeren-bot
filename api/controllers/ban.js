const Ban = require("../../models/ban");

// GET /bans
exports.bans_get_all = (req, res, next) => {
  Ban.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        all_bans: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// GET /bans/:userId
exports.bans_get_user = (req, res, next) => {
  const userId = req.params.userId;
  Ban.find({ user_id: userId })
    .exec()
    .then(doc => {
      res.status(200).json({
        bans: doc
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
