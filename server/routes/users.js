const express = require('express');
const router = express.Router();
const bruteforce = require('../middlewares/bruteforce');
const usersController = require('../controllers/users')
const { Site } = require('../models');

Site.find().then((sites) => {

  router.post('/',
    bruteforce.getMiddleware({
      key: function(req, res, next) {
        // prevent too many attempts for the same email
        next(req.body.email);
      }
    }),
  usersController)

});

module.exports = router;
