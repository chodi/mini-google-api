var express = require('express');
var router = express.Router();
var oauth2 = require ('./oauth2');

/* GET home page. */
router.get('/', function(req, res, next) {
  const generateAuthUrl =  oauth2.generateAuthUrl('list_mail_id');
  res.redirect(generateAuthUrl);
});

module.exports = router;
