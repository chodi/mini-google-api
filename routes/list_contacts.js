var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const LIST_CONTACT_URL = 'https://people.googleapis.com/v1/people/me/connections?requestMask.includeField=person.photos%2Cperson.names%2Cperson.emailAddresses%2Cperson.phoneNumbers';
router.get('/', function(req, res, next) {
  fetch(LIST_CONTACT_URL, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.query.access_token,
    },
  })
  .then((res) => { return res.json() })
  .then((json) => {
    res.render('list_contacts', { connections: json.connections });
  });
});


module.exports = router;
