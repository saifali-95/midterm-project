const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/:id", (req, res) => {
    const sellerID = req.params.id;

    db.query(`
      SELECT products.*, users.name as seller_name
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
        sellerName: data.rows[0].seller_name
      }
      console.log(data.rows, 'data.rows');
      res.render("show_seller", products);
    })
  });

  return router;
};
