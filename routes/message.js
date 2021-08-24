/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("message");
  });
  router.post("/", (req, res) => {

  const message = req.body.message;
  console.log(message);

  client.messages
    .create({
      body: `${message}`,
      from: '+16826228584',
      to: '+16139157474'
    })
    .then(message => console.log(message.sid))
    .catch(error => console.log(error));
  });

  return router;
};





