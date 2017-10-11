var express = require('express');
var router = express.Router();
var request = require('request');
var fetch = require('node-fetch');
const secret = require('../SECRET');  //***YOUR API KEY HERE***

const gapi_key = secret.API_KEY;

/* GET Url request. */
router.post('/', function(req, res, next) {
  const longUrl = req.body.url;
  fetch(`https://www.googleapis.com/urlshortener/v1/url?key=${gapi_key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      longUrl,
    })
  })
  .then(function(response) {
    return response.json()
  })
  .then((body) => {
    res.send(`Here's the link of <a href="${body.id}">${body.longUrl}</a>:<br/>${body.id}`)
  })
  .catch(function(error) {
    res.send('request failed', error)
  })

});

module.exports = router;
