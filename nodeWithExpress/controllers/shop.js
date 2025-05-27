const Product = require("../models/product");
const Order = require("../models/order");

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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.user,
      });
    })
    .catch((e) => console.log("error from getIndex", e));
};

exports.getCart = (req, res, next) => {
  req?.user
    ?.populate("cart.items.productId", "title")
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
        isAuthenticated: req?.session?.isLoggedIn,
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
  // req.user
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
      isAuthenticated: req.session.user,
    });
  });
};

exports.postOrder = (req, res, next) => {
  // req.user
  req.user
    .populate("cart.items.productId", "title")
    .then((user) => {
      console.log("Products in postOrder", user, user.cart.items);
      const productsFromCart = user.cart.items.map((item) => {
        return {
          product: { ...item.productId._doc },
          quantity: item.quantity,
        };
      });
      const order = new Order({
        products: productsFromCart,
        user: {
          name: req.user.name, //req.user.name,
          userId: req.user, //req.user,
        },
      });
      return order.save();
    })
    .then(() => req.user.clearCart()) // req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((e) => console.log("error in postOrder", e));

  // req.user
  //   .addOrder()
  //   .then(() => res.redirect("/orders"))
  //   .catch((e) => console.log("error in postOrder", e));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }) //req.user._id })
    .then((orders) => {
      console.log("Orders from getOrders", orders, orders[0].products);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.user,
      });
    })
    .catch((e) => console.log("err in getOrders", e));
  // req.user
  //   .getOrders()
  //   .then((orders) => {
  //     res.render("shop/orders", {
  //       docTitle: "Your Orders",
  //       path: "/orders",
  //       orders: orders,
  //     });
  //   })
  //   .catch((e) => console.log("err in getOrders", e));
};
