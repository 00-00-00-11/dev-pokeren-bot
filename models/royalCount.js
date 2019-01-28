const mongoose = require("mongoose");

const royalCountSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    server_name: String,
    server_id: String,
    type: String,
    count: Number,
    timestamp: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("RoyalCounter", royalCountSchema);
