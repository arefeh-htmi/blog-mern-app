const { Schema } = require("mongoose");

const unverifiedSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expires: { type: Date, required: true },
});

module.exports = {unverifiedSchema};
