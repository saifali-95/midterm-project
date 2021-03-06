/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {


  router.get("/:name", (req, res) => {
    const categoryName = req.params.name;

    db.query(`
      SELECT products.*, users.name as seller_name
      FROM products
      LEFT JOIN categories
      ON category_id = categories.id
      JOIN users
      ON users.id = seller_id
      WHERE categories.name = $1
    `, [categoryName])

    .then(data => {
      const products = {
        products: data.rows,
        categoryName,
        user: req.session.name
      }
      res.render("show_categories", products);
    })
  });


  router.post("/:name/price", (req, res) => {
    const categoryName = req.params.name;
    const priceLim = req.body.price;

    db.query(`
      SELECT products.*, users.name as seller_name
      FROM products
      LEFT JOIN categories
      ON category_id = categories.id
      JOIN users
      ON users.id = seller_id
      WHERE categories.name = $1
    `, [categoryName])

      .then(data => {
        const products = {
          products: data.rows,
          categoryName,
          user : req.session.name
        }
        products.products = products.products.filter(product => {
          return product.price < priceLim;
        });
        res.render("show_categories", products);
      })
  });

  return router;

};
