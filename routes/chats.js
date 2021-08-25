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
    const user_id = req.session.user_id;
    //const user = req.session.name;

    db.query(`SELECT id FROM chat_service WHERE from_id = $1 OR to_id = $1`, [user_id])
    .then(data => {
      console.log(data.rows);
      const templateVars =  {data: data.rows, user_id};
      res.render("chats", templateVars)
    })
    return;
  });

  router.get("/:id", (req, res) => {
    // const user_id = req.session.user_id;
    res.send('Hello WOrld')

    //const user = req.session.name;

  });






  router.post("/", (req, res) => {
    const seller_id = 2;
    const message = req.body.message;
    const from_id = req.session.user_id;

    db.query(`
    SELECT * FROM users
    WHERE id = $1;
    `,[seller_id])
    .then(data => {
      db.query(`INSERT INTO chats (from_id, to_id, message, product_id)
      VALUES ($1, $2, $3, $4)
      `, [from_id, 2, `${message}`, 2])

      const user = data.rows[0];
      console.log('user', user);
      client.messages
      .create({
        body: `${message}`,
        from: `${twilioNumber}`,
        to: `${user.phone}`
      })
      res.redirect('/chats');
    })
  });
  return router;
};





