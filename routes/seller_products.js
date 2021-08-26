const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/mylist", (req, res) => {
    const seller_id = req.session.user_id
    if (!seller_id) {
      return res.send("Please <a href='/login'>login</a> first");
    }
    db.query(`
      SELECT products.*, categories.name as cat_name, users.name as seller_name
      FROM products
      JOIN categories
      ON category_id = categories.id
      JOIN users
      ON seller_id = users.id
      WHERE seller_id = $1
    `, [seller_id])
    .then(data => {
      const templateVars = {
        products: data.rows,
        seller_id,
        user: req.session.name
      }
      console.log(templateVars.user, "templateVars.user");
      res.render("show_seller", templateVars);
    })
  })

  router.get("/:id", (req, res) => {
    const sellerID = req.params.id;
    const admin_id = req.session.user_id;
    if (!admin_id) {
      return res.send("Please <a href='/login'>login</a> first");
    }
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
      const seller_id = req.session.user_id === sellerID ? sellerID : null
      const templateVars = {
        products: data.rows,
        seller_id,
        sellerID,
        user: req.session.name
      }
      res.render("show_seller", templateVars);
    })
  });



  router.post("/:id/price", (req, res) => {
    const sellerID = req.params.id;
    const priceLim = req.body.price;
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
      const seller_id = req.session.user_id === sellerID ? sellerID : null
      const products = {
        products: data.rows,
        seller_id,
        user: req.session.name
      }
        products.products = products.products.filter(product => {
          return product.price < priceLim;
        });
        res.render("show_seller", products);
      })
  });

  return router;
};
