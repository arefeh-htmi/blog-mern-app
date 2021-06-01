const { Schema } = require("mongoose");

const userSchema = new Schema({
  email: String,
  username: String,
  hash: String,
  role: { type: String, default: "subscriber" },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
});

module.exports = {userSchema};
