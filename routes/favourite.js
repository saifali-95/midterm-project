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
    const {user_id} = req.session;
    if (!user_id) {
      return res.send("Please <a href='/login'>login</a> first!")
    }
    db.query(`
      SELECT products.*, favourites.* FROM favourites
      JOIN products ON product_id = products.id
      WHERE user_id = $1
    `, [user_id])
    .then(data => {
      const templateVars = {
        products: data.rows,
        user: req.session.name,
        user_id
      }
      res.render("favourite", templateVars);
    })
  });

  router.post("/", (req, res) => {
    const {productId} = req.body;
    if (req.session.user_id) {
      const user_id = req.session.user_id;
      db.query(`
       SELECT * FROM favourites
       WHERE user_id = $1
       AND product_id = $2`, [user_id, productId])
      .then(data => {
        if (data.rows.length === 0) {
          db.query(`
            INSERT INTO favourites (user_id, product_id)
            VALUES($1, $2);
          `, [user_id, productId])
          .then(() => console.log("then 2:"))
          .catch(err => {
            console.log("catch 1:", err);
            // return res.json({err: err.message})
          });
        } else {
          db.query(`
          DELETE FROM favourites
          WHERE user_id = $1
          AND product_id = $2`, [user_id, productId])
          .then()
          .catch(err => {
            console.log("catch 2: ", err);
            // return res.json({err: err.message})
          }) ;
        }
      })
      .catch(err => {
        console.log("catch 3:", err);

        // return res.json({err: err.message})
      });
    }
      return res.send("Please login first!!!");
  });

  return router;
};
