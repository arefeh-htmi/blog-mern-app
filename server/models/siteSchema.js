const { Schema } = require("mongoose");

const widgetAreaField = {
  type: [
    {
      _id: { type: Schema.ObjectId, required: true },
      type: { type: String, required: true },
      order: { type: Number, required: true },
      title: Schema.Types.Mixed,
      body: Schema.Types.Mixed,
    },
  ],
  default: [],
};

const siteSchema = new Schema({
  _id: {
    domain: { type: String },
    collectionPrefix: { type: String },
  },
  title: String,
  description: String,
  front_page: {
    show_on_front: { type: String, default: "posts" },
    page_on_front: Schema.ObjectId,
    page_for_posts: Schema.ObjectId,
  },
  template: { type: String, default: "light" },
  themes: {
    type: Array,
    default: [
      { template: "light", name: "Light", author: "BloggingAppCMS" },
      { template: "dark", name: "Dark", author: "BloggingAppCMS" },
    ],
  },
  menus: {
    type: [
      {
        _id: { type: Schema.ObjectId, required: true },
        name: { type: String, required: true },
        items: [
          {
            _id: { type: Schema.ObjectId, required: true },
            parent: Schema.ObjectId,
            order: { type: Number, required: true },
            label: String,
            type: { type: String, required: true },
            guid: String,
          },
        ],
      },
    ],
    default: [],
  },
  header: widgetAreaField,
  top_content: widgetAreaField,
  bottom_content: widgetAreaField,
  left_sidebar: widgetAreaField,
  right_sidebar: widgetAreaField,
  footer: widgetAreaField,
  // comments:
  // disqus: {
  //   enabled_on: ["posts"],
  //   shortname: "pages",
  // }
});

module.exports = { siteSchema };
