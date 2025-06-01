const express = require("express");

const { body } = require("express-validator");
const adminController = require("../controllers/admin");

const isAuthMiddleware = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuthMiddleware, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    // body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5, max: 30 }),
  ],
  isAuthMiddleware,
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isAuthMiddleware,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5, max: 30 }),
  ],
  isAuthMiddleware,
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  isAuthMiddleware,
  adminController.postDeleteProduct
);

router.get("/products", isAuthMiddleware, adminController.getProducts);

module.exports = router;
