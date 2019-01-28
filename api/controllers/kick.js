const Kick = require("../../models/kick");

// GET /kicks
exports.kicks_get_all = (req, res, next) => {
  Kick.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        all_kicks: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// GET /kicks/:userId
exports.kicks_get_user = (req, res, next) => {
  const userId = req.params.userId;
  Kick.find({ user_id: userId })
    .exec()
    .then(doc => {
      res.status(200).json({
        kicks: doc
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
