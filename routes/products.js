/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/addItem", (req, res) => {
    res.render("addItem");
  });

  router.post("/addItem", (req, res) => {
    const {
      name,
      info,
      size,
      color,
      brand,
      price,
      photo,
      category,
      user_id
    } = req.body;
    if (user_id) {
      const seller_id = user_id;
      db.query(`
        SELECT id FROM categories
        WHERE name = $1
        `, [category])
      .then(data => {
        console.log(data)
        const category_id = Number(data.rows[0].id);
        db.query(`
          INSERT INTO products (name, info, size, color, brand, price, thumbnail_photo_url, category_id, seller_id)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
          `, [name, info, size, color, brand, price, photo, category_id, seller_id])
        .then(data => {
          db.query(`
          SELECT * FROM products
          WHERE category_id = $1`, [category_id]).then(data => console.log(data.rows))
        })
        .catch(err => {
          return res.send().status().json({err: err.message})
        }) ;
      })
      .catch(err => {
        return res.send().status().json({err: err.message});
      });
      return res.redirect("/");
    }
    return res.send("Please login first!!!");
  });
  router.post("/:id/delete", (req, res) => {
    const product_id =  req.params.id;
    const seller_id = req.session.user_id
    if (!seller_id) {
      return res.send("Please login first!");
    }
    db.query(`
      DELETE FROM products
      WHERE products.id = $1
      AND seller_id = $2
    `, [product_id, seller_id])
    .then(() => res.send("Your item successfully removed!"))
    .catch(err => {
      res.send().status().json({err: err.message})
    })
  });
  return router;
};
