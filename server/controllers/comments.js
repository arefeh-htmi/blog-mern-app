const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { isEmpty } = require("lodash");
const { isUserCapable } = require("../utils/bloggingappcms");
const { populateSort, tagsCount } = require("../utils");

const { compiledModels } = require("../models");
const assert = require("assert");
const { response } = require("../app");
// authenticate

router.post("/add", authenticate, (req, res, next) => {
  const { currentUser } = req;
  const { autherId, postId, replyTo, content } = req.body;
  const errors = {};

  if (isEmpty(postId)) return res.sendStatus(403);
  if (isEmpty(content)) errors.content = "Please enter some content.";
  if (!isEmpty(errors)) return res.status(401).json({ errors });

  // New comment

  let newComment = {
    autherId,
    postId,
    replyTo: isEmpty(replyTo) ? null : replyTo,
    content,
  };
  compiledModels[currentUser.collectionPrefix].Comment.create(
    newComment,
    (err, doc) => {
      assert.ifError(err);
      populateSort(doc, null, (doc) => res.status(201).json(doc));
    }
  );
});

router.get("/", authenticate, (req, res, next) => {
  const {
    currentUser,
    query: { collectionPrefix, postId },
  } = req;

  if (postId) {
    populateSort(
      compiledModels[currentUser.collectionPrefix].Comment.find({ postId }),
      null,
      (doc) => {
        res.json(doc);
      }
    );
  }
});

router.delete("/:_id?", authenticate, (req, res, next) => {
  const {
    currentUser,
    params: { _id },
    query: { ids },
  } = req;

  if (_id) {
    // single delete

    populateSort(
      compiledModels[currentUser.collectionPrefix].Post.findOne({ _id }),
      null,
      (doc) => {
        if (doc) {
          if (isUserCapable("delete", "post", currentUser, doc)) {
            if (doc.status !== "trash") {
              doc.status = "trash";
              doc.save((err) => {
                assert.ifError(err);
                res.send(doc);
              });
            } else {
              doc.status = "delete";
              doc.remove();

              tagsCount(compiledModels[currentUser.collectionPrefix]);
              res.send(doc);
            }
          } else {
            res.sendStatus(403);
          }
        } else {
          res.sendStatus(404);
        }
      }
    );
  } else {
    // multiple delete

    populateSort(
      compiledModels[currentUser.collectionPrefix].Post.find({
        _id: { $in: ids },
      }),
      null,
      (docs) => {
        let nextStatus;

        docs.forEach((doc) => {
          if (isUserCapable("delete", "post", currentUser, doc)) {
            if (doc.status !== "trash") {
              doc.status = "trash";
              doc.save((err) => assert.ifError(err));
            } else {
              doc.status = "delete";
              doc.remove();

              tagsCount(compiledModels[currentUser.collectionPrefix]);
            }

            if (!nextStatus) nextStatus = doc.status;
          }
        });

        res.send({
          n: docs.length,
          status: nextStatus,
        });
      }
    );
  }
});

module.exports = router;
