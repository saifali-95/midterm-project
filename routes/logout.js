/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = () => {

  router.post("/", (req, res) => {
    req.session = null;
    return res.redirect("/");
  })
  return router;
};



