const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/:id", (req, res) => {
    const sellerID = req.params.id;

    db.query(`
      SELECT products.*, categories.name as cat_name, users.name as seller_name
      FROM users
      LEFT JOIN products
      ON users.id = seller_id
      LEFT JOIN categories
      ON category_id = categories.id
      WHERE seller_id = $1
    `, [sellerID])

    .then(data => {
      const products = {
        products: data.rows,
      }
      res.render("show_seller", products);
    })
  });

  router.get("/mylist", (req, res) => {
    const seller_id = req.session.user_id
    db.query(`
      SELECT products.*, categories.name AS cat_name
      FROM products
      ON category_id = categories.id
      WHERE seller_id = $1
    `, [seller_id])
    .then(data => {
      const templateVars = {
        products: data.rows,
        seller_id
      }
      res.render("show_seller", templateVars);
    })
  })

  return router;
};
