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
    const user = req.session.name;

    db.query(`SELECT users.name as seller_name, products.name as product_name FROM users JOIN products ON seller_id = users.id WHERE products.id =$1;
    `, [product_id])
    .then(data => {
      const templateVars = {data: data.rows[0], product_id, user};
      res.render("message", templateVars);
    })

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

    //RUN A QUERY TO CHECK IF THE BUYER AND SELLER ARE ALREADY TALKING ABOUT CERTAIN PRODUCT, IF NO THEN INITIATE CHAT_SERVICE_ID FOR THAT PARTICULAR CHAT

    db.query(`SELECT * FROM chat_service WHERE from_id = $1 and product_id = $2`, [buyer, product_id])
    .then(data => {
      if(data.rows.length === 0) {
      db.query(`INSERT INTO chat_service (from_id, to_id, product_id)
      VALUES ($1, $2, $3)
      `, [buyer, seller_id ,product_id])
      }
      //return data;
    })


    //ONCE A CHAT_SERVICE IS INITIATED BETWEEN USERS, THEN ALL RELATED CHAT WILL BE INSERTED INTO CHATS TABLE WITH THE UNIQUE CHAT_SERVICE_ID

    db.query(`SELECT * FROM chat_service WHERE from_id = $1 and product_id = $2`, [buyer, product_id])
    .then(data => {
      const chat_service = data.rows[0].id;
      db.query(`INSERT INTO chats (from_id, to_id, message, product_id, chat_service_id)
      VALUES ($1, $2, $3, $4, $5)
      `, [buyer, seller_id ,message,product_id, chat_service])

    //SEND A TEXT MESSAGE VIA SMS TWILIO API TO THE END USER;
      client.messages
      .create({
        body: `${message}`,
        from: `${twilioNumber}`,
        to: `${phone}`
      })

      res.redirect(`/chats/${chat_service}`)
    })
    })

  });

  return router;
};





