/*
 * All routes for Register are defined here
 * Since this file is loaded in server.js into /register,
 *   these routes are mounted onto /register
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("register");
  });
  router.post("/", (req, res) => {

    const {name, email, phone, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query(`
      SELECT * FROM users
      WHERE email = $1;
      `, [email])
      .then(data => {
        console.log(data.rows)
        if (data.rows.length === 0) {
          if(name !== '' && email !== '' && phone !== '', password !== '') {
            db.query(`
            INSERT INTO users (name, email, phone, password)
            VALUES ($1, $2, $3, $4)`, [name, email, phone, hashedPassword])
            .then(() => res.redirect("/login"))
            .catch(err => {
              res.send().status(500).json({error: err.message});
            });
          } else {
            res.send("Please fill out all fileds");
          }
        } else {
          res.send("The account already exists");
        }
      })
      .catch(err => {
        res.send().status(500).json({error: err.message});
      });
  });
  return router;
};





