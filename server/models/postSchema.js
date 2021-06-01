const { Schema } = require("mongoose");

const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: "publish" },

  date: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
});

module.exports = {postSchema};
