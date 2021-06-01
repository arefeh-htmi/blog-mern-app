const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const {
  addTagscontroller,
  getTagsController,
  editTagsController,
  deleteTagsController,
} = require("../controllers/tags");

router.post("/add", authenticate, addTagscontroller);

router.get("/", getTagsController);

router.post("/edit", authenticate, editTagsController);

router.delete("/:_id?", authenticate, deleteTagsController);

module.exports = router;
