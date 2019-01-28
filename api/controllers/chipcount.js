const Chipcount = require("../../models/chipcount");

// GET /chipcount
exports.chipcount_get_all = (req, res, next) => {
  Chipcount.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        all_chipcounts: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// GET /chipcount/:userId
exports.chipcount_get_one = (req, res, next) => {
  const userId = req.params.userId;
  Chipcount.find({ user_id: userId })
    .exec()
    .then(docs => {
      res.status(200).json({
        chipcount: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
