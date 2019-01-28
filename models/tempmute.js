const mongoose = require("mongoose");

const tempmuteSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    user_id: String,
    muted_by: String,
    reason: String,
    duration: String,
    timestamp: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("Tempmute", tempmuteSchema);
