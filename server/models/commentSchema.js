const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    autherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
    },
    postId: {
      type: Schema.ObjectId,
      //   required: true,
      ref: "Post",
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
      //   required: true,
    },
  },
  { timestamps: true }
);

module.exports = { commentSchema };
//   date: { type: Date, default: Date.now },
