var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const base_url = 'https://www.googleapis.com/';
const headers = (access_token) => {
  return {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  };
}
router.get('/', function(req, res, next) {
  const access_token = req.query.access_token;
  fetch(`${base_url}userinfo/v2/me`, headers(access_token))
  .then((resultOfMyInfo) => resultOfMyInfo.json())
  .then((person) => {
      fetch(`${base_url}gmail/v1/users/me/messages?maxResults=10`, headers(access_token))
      .then((list) => { return list.json() })
      .then((listOfMessageIds) => {
        Promise.all(_fetch(listOfMessageIds.messages, access_token))
        .then((mail_message_result) => Promise.all(toJson(mail_message_result)))
        .then((mail_message_result) => {
          const newMEssages = mergeMessageWithId(listOfMessageIds.messages, mail_message_result);
          res.render('mail_id', { ids: listOfMessageIds.messages, person, newMEssages });
        })
      });
  })
});

function mergeMessageWithId(arrayOfIds, arrayOfMessages) {
  return arrayOfIds.map((msgId) => {
    const msgObj = arrayOfMessages.find((msg) => msgId.id === msg.id);
    const stringToconvert = msgObj.payload.body.data;
    const header = msgObj.payload.headers.find((head) => head['name'] === 'Subject').value;
    msgId.messageBody = stringToconvert ? Buffer.from(stringToconvert, 'base64').toString("ascii") : '';
    msgId.header = header;
    return msgId;
  });
}
function toJson(arrayOfresponse) {
  return arrayOfresponse.map((res) => res.json());
}
function _fetch(listOfMessageIds, access_token) {
  return listOfMessageIds.map((msgId) => fetch(`${base_url}gmail/v1/users/me/messages/${msgId.id}?fields=id%2Cpayload(body%2Cheaders)%2Csnippet`,
    headers(access_token)));
}
module.exports = router;
