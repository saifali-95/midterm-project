/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/:name", (req, res) => {
    const categoryName = req.params.name
    const {user_id} = req.session.id;
    db.query(`
      SELECT products.*
      FROM products
      LEFT JOIN categories
      ON category_id = categories.id
      WHERE categories.name = $1
    `, [categoryName])

    .then(data => {
      const products = {

        products: data.rows,
        categoryName
      }
      console.log(data.rows, 'data.rows');
      res.render("show_categories", products);
    })
  });



  return router;
};
