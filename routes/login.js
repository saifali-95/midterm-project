/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("login");
  });
  router.post("/", (req, res) => {

    const {email, password} = req.body;
    db.query(`
      SELECT * FROM users
      WHERE email = $1;
      `, [email])
      .then(data => {
        const user = data.rows[0];
        const hashedPassword = data.rows[0].password;

        //COMPARE IF THE USER EXIST IN THE DATABASE AND IF THE TYPED PASSWORD MATCHES THE HASHED PASSWORD IN THE DATABASE USING BCRYPT;

        if (user && bcrypt.compareSync(password, hashedPassword)) {
        console.log('successful');
        req.session.name = user.name;
        req.session.user_id = user.id;
        return res.redirect("/");

        }
        return res.send("<html><head></head><body>Email/password combination is not correct try <a href='/login'>login</a> again!</body></html>");

      })
      .catch(err => {
        res.send().status(500)
        .json({error: err.message});
      });
  });

  return router;
};





