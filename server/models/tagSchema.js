const { Schema } = require("mongoose");

const tagSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  count: { type: Number, default: 0 },
});

module.exports = {tagSchema};
