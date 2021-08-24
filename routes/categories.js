/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("show_categories");
  });
  router.get("/categories", (req, res) => {
    // const {user_id} = req.session.id;
    // db.query(`
    //   SELECT *
    //   FROM products
    //   LEFT JOIN categories
    //   ON category_id = categories.id
    // `, category_id)
    // .then(data => {
    //   templateVars = {
    //     products: data.rows
    //   }
    // })
    // res.render("show_categories", products);
    res.render("show_categories");
  });



  return router;
};
