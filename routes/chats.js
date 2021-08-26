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
    const user = req.session.name;

    db.query(`SELECT id FROM chat_service WHERE from_id = $1 OR to_id = $1`, [user_id])
    .then(data => {
      const templateVars =  {data: data.rows, user_id, user};
      res.render("chats", templateVars)
    })
    return;
  });

  router.get("/:id", (req, res) => {
    const user = req.session.name;
    const chat_id = req.params.id;

    //const user = req.session.name;

    db.query(`SELECT to_id, from_id, message, time FROM chats WHERE chat_service_id = $1;`, [chat_id])
    .then(data => {

      const templateVars =  {data: data.rows, user, chat_id};
      res.render("chatDisplay", templateVars)
    })
    return;

  });

  router.post("/:id", (req, res) => {
    const message = req.body.message;
    const from_id = req.session.user_id;
    const chat_id = req.params.id;

    db.query(`
    SELECT * FROM chat_service
    WHERE id = $1;
    `,[chat_id])

    .then(data => {

      const to_id = (from_id === data.rows[0].from_id) ? data.rows[0].to_id : data.rows[0].from_id;
      const product_id = data.rows[0].product_id;

      db.query(`INSERT INTO chats (from_id, to_id, message, product_id, chat_service_id)
      VALUES ($1, $2, $3, $4, $5);
      `, [from_id, to_id, `${message}`, product_id, chat_id])

      return (data);
    })

    .then(data => {
      const to_id = (from_id === data.rows[0].from_id) ? data.rows[0].to_id : data.rows[0].from_id;

      db.query(`SELECT phone FROM users WHERE users.id= $1;`
       ,[to_id])


      .then(data=>{
      const to_phone = data.rows[0].phone;

      console.log('phone NUmber', to_phone);
      console.log('message: ', message);

      client.messages
      .create({
        body: `${message}`,
        from: `${twilioNumber}`,
        to: `${to_phone}`
      })
      res.redirect(`/chats/${chat_id}`);

      })
    })
  });
  return router;
};





