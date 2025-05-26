const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    // Product.fetchAll()
    .then((products) => {
      console.log("products from getProducts", products);
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All products",
        path: "/products",
        hasProducts: products.length > 0,
      });
    })
    .catch((err) => console.log("error while fetching all products", err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // Product.findById(prodId)
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        docTitle: product?.title,
        product: product,
        path: "/products",
      });
    })
    .catch((e) => console.log("err", e));
};

exports.getIndex = (req, res, next) => {
  // Product.fetchAll()
  Product.find()
    .then((products) => {
      console.log("res from getindex", products);
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((e) => console.log("error from getIndex", e));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId", "title")
    .then((user) => {
      console.log(
        "Products in getProducts from getCart",
        user,
        user.cart.items
      );
      res.render("shop/cart", {
        docTitle: "Your cart",
        path: "/cart",
        products: user.cart.items,
      });
    })
    .catch((err) => console.log("error in getCart", err));
  // req.user
  //   .getCart()
  //   .then((products) => {
  //     console.log("Products in getProducts from getCart", products);
  //     res.render("shop/cart", {
  //       docTitle: "Your cart",
  //       path: "/cart",
  //       products: products,
  //     });
  //   })
  //   .catch((err) => console.log("error in getCart", err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("result from postCart", result);
      res.redirect("/cart");
    })
    .catch((e) => console.log("error in postCart method", e));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteProductFromCart(productId)
    .then(() => res.redirect("/cart"))
    .catch((e) => console.log("error while deleting item from the cart", e));
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      docTitle: "Checkout",
      path: "/checkout",
      hasProducts: products.length > 0,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect("/orders"))
    .catch((e) => console.log("error in postOrder", e));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((e) => console.log("err in getOrders", e));
};
