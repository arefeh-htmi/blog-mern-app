const { siteSchema } = require("./siteSchema.js");
const { userSchema } = require("./userSchema.js");
const { unverifiedSchema } = require("./unverifiedSchema.js");
const { bruteForceSchema } = require("./bruteForceSchema.js");
const { tagSchema } = require("./tagSchema.js");
const { postSchema } = require("./postSchema.js");
const { commentSchema } = require("./commentSchema");


module.exports = {
  siteSchema,
  userSchema,
  unverifiedSchema,
  bruteForceSchema,
  tagSchema,
  postSchema,
  commentSchema
};
