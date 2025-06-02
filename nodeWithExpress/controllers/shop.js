const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

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
    .catch((e) => {
      console.log("error while fetching all products", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((e) => {
      console.log("err", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((e) => {
      console.log("error from getIndex", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((e) => {
      console.log("error in getCart", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((e) => {
      console.log("error in postCart method", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  // req.user
  req.user
    .deleteProductFromCart(productId)
    .then(() => res.redirect("/cart"))
    .catch((e) => {
      console.log("error while deleting item from the cart", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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
          // name: req.user.name, //req.user.name,
          email: req.user.email,
          userId: req.user, //req.user,
        },
      });
      return order.save();
    })
    .then(() => req.user.clearCart()) // req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((e) => {
      console.log("error in postOrder", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });

  // req.user
  //   .addOrder()
  //   .then(() => res.redirect("/orders"))
  //   .catch((e) => console.log("error in postOrder", e));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }) //req.user._id })
    .then((orders) => {
      console.log("Orders from getOrders", orders);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.user,
      });
    })
    .catch((e) => {
      console.log("err in getOrders", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorised!"));
      }
      const invoiceName = `Invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.text("Hello World!");

      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `inline; filename="${invoiceName}"`
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      // file.pipe(res);
    })
    .catch((err) => {
      console.log("error while fetching order in getInvoice", err);
      next(err);
    });
};
