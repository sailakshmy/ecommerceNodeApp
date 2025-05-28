const express = require("express");
const adminController = require("../controllers/admin");

const isAuthMiddleware = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuthMiddleware, adminController.getAddProduct);

router.post("/add-product", isAuthMiddleware, adminController.postAddProduct);

router.get(
  "/edit-product/:productId",
  isAuthMiddleware,
  adminController.getEditProduct
);

router.post("/edit-product", isAuthMiddleware, adminController.postEditProduct);

router.post(
  "/delete-product",
  isAuthMiddleware,
  adminController.postDeleteProduct
);

router.get("/products", isAuthMiddleware, adminController.getProducts);

module.exports = router;
