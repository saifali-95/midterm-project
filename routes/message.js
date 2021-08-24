/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("message");
  });
  router.post("/", (req, res) => {
    const seller_id = 2;
    const message = req.body.message;

    db.query(`
    SELECT * FROM users
    WHERE id = $1;
    `,[seller_id])
    .then(data => {
      db.query(`INSERT INTO chats (from_id, to_id, message, product_id)
      VALUES ($1, $2, $3, $4)
      `, [1, 2, `${message}`, 2])

      const user = data.rows[0];
      client.messages
      .create({
        body: `${message}`,
        from: `${twilioNumber}`,
        to: `${user.phone}`
      })
      return;
    })
  });
  return router;
};





