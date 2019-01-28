const Tempmute = require("../../models/tempmute");

// GET /tempmutes
exports.tempmute_get_all = (req, res, next) => {
  Tempmute.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        all_tempmutes: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// GET /tempmutes/:userId
exports.tempmute_get_user = (req, res, next) => {
  const userId = req.params.userId;
  Tempmute.find({ user_id: userId })
    .exec()
    .then(doc => {
      res.status(200).json({
        tempmutes: doc
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
