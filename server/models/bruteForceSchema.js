const { Schema } = require("mongoose");

const bruteForceSchema = new Schema({
  _id: String,
  data: {
    count: Number,
    lastRequest: Date,
    firstRequest: Date,
  },
  expires: Date,
});

module.exports = { bruteForceSchema };
