/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("login");
  });
  router.post("/", (req, res) => {

    const {email, password} = req.body;
    db.query(`
      SELECT * FROM users
      WHERE email = $1 AND password = $2;
      `, [email, password])
      .then(data => {
        const user =  data.rows[0]

        if (!user) {
          return res.send("<html><head></head><body>Email/password combination is not correct try <a href='/login'>login</a> again!</body></html>");
        }

        req.session.name = user.name;
        req.session.user_id = user.id;
        res.redirect("/");
      })
      .catch(err => {
        res.send().status(500)
        .json({error: err.message});
      });
  });

  return router;
};





