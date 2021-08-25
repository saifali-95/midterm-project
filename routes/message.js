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
const { LogInstance } = require('twilio/lib/rest/serverless/v1/service/environment/log');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    const product_id = req.params.id;
    const templateVars = {product_id};
    res.render("message", templateVars);
  });

  router.post("/:id", (req, res) => {

    const message = req.body.message;
    const product_id = req.params.id;
    const buyer = req.session.user_id;

    db.query(`
    SELECT phone, users.id FROM users JOIN products ON seller_id = users.id
    WHERE products.id = $1;
    `,[product_id])

    .then(data => {
      const seller_id = data.rows[0].id;
      const phone =  data.rows[0].phone;

      db.query(`INSERT INTO chats (from_id, to_id, message, product_id)
      VALUES ($1, $2, $3, $4)
      `, [buyer, seller_id , `${message}`, product_id])

      const user = data.rows[0];
      console.log('user phone:', user);
      client.messages
      .create({
        body: `${message}`,
        from: `${twilioNumber}`,
        to: `${phone}`
      })
      return;
    })
  });
  return router;
};





