const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All products",
      path: "/products",
      hasProducts: products.length > 0,
      //   activeShop: true,
      //   productCSS: true,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log("productId", prodId);

  Product.findById(prodId, (product) => {
    // console.log("object", product);
    res.render("shop/product-detail", {
      docTitle: product.title,
      product: product,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      //   activeShop: true,
      //   productCSS: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/cart", {
      //   prods: products,
      docTitle: "Your cart",
      path: "/cart",
      hasProducts: products.length > 0,
      //   activeShop: true,
      //   productCSS: true,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("object", prodId);
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect("/cart");
  });
  // res.render("/cart");
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      //   prods: products,
      docTitle: "Checkout",
      path: "/checkout",
      hasProducts: products.length > 0,
      //   activeShop: true,
      //   productCSS: true,
    });
  });
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/orders", {
      //   prods: products,
      docTitle: "Your Orders",
      path: "/orders",
      hasProducts: products.length > 0,
      //   activeShop: true,
      //   productCSS: true,
    });
  });
};
