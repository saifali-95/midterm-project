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
    const templateVars = {
      user: req.session.name
    }
    res.render("addItem", templateVars);
  });

  router.get("/:productId", (req, res) => {
    const {productId} = req.params;
    console.log(req.params)
    db.query(`
    SELECT products.*, categories.name AS category_name, users.name AS seller
    FROM products
    JOIN categories
    ON category_id = categories.id
    JOIN users
    ON products.seller_id = users.id
    WHERE products.id = $1`, [productId])
    .then(data => {
      const templateVars = {
        product: data.rows[0],
        user: req.session.name
      }

      res.render("show_item", templateVars);
    })
    .catch(err => {
      res.send().status().json({err: err.message});
    })
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
    } = req.body;

    const seller_id = req.session.user_id;
    if (seller_id) {
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
          WHERE category_id = $1`, [category_id])
          .then(data => {
            console.log(data.rows)
          })
        })
        .catch(err => {
          return res.send().status().json({err: err.message})
        }) ;
      })
      .catch(err => {
        return res.send().status().json({err: err.message});
      });
      return res.redirect("/seller/mylist");
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
    .then(() => res.redirect("/seller/mylist"))
    .catch(err => {
      res.send().status().json({err: err.message})
    })
  });

  router.post("/:id/sold", (req, res) => {
    const product_id =  req.params.id;
    const seller_id = req.session.user_id

    console.log('Sold Item');


    if (!seller_id) {
      return res.send("Please login first!");
    }
    db.query(`
      UPDATE products
      SET stock = false
      WHERE products.id = $1;
    `, [product_id])
    .then(() => res.redirect("/seller/mylist"))
    .catch(err => {
      res.send().status().json({err: err.message})
    })

  })


  return router;
};
