const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/product-list", {
  //     prods: products,
  //     docTitle: "All products",
  //     path: "/products",
  //     hasProducts: products.length > 0,
  //   });
  // });
  // Product.fetchAll()
  //   .then(([rows, columns]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       docTitle: "All products",
  //       path: "/products",
  //       hasProducts: rows.length > 0,
  //     });
  //   })
  //   .catch((err) => console.log(err));

  Product.findAll()
    .then((products) => {
      console.log("res from getProducts", products);
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All products",
        path: "/products",
        // hasProducts: rows.length > 0,
      });
    })
    .catch((e) => console.log("error from getProducts", e));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // Product.findById(prodId, (product) => {
  //   res.render("shop/product-detail", {
  //     docTitle: product.title,
  //     product: product,
  //     path: "/products",
  //   });
  // });
  Product.findById(prodId)
    .then(([row]) => {
      res.render("shop/product-detail", {
        docTitle: row?.[0].title,
        product: row?.[0],
        path: "/products",
      });
    })
    .catch((e) => console.log("err", e));
};

exports.getIndex = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/index", {
  //     prods: products,
  //     docTitle: "Shop",
  //     path: "/",
  //     hasProducts: products.length > 0,
  //   });
  // });
  // Product.fetchAll()
  //   .then(([rows, columns]) => {
  //     res.render("shop/index", {
  //       prods: rows,
  //       docTitle: "Shop",
  //       path: "/",
  //       hasProducts: rows.length > 0,
  //     });
  //   })
  //   .catch((err) => console.log(err));
  Product.findAll()
    .then((products) => {
      console.log("res from getindex", products);
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        // hasProducts: products.length > 0,
      });
    })
    .catch((e) => console.log("error from getIndex", e));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((allProducts) => {
      const productsInCart = [];
      for (const product of allProducts) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          productsInCart.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render("shop/cart", {
        docTitle: "Your cart",
        path: "/cart",
        products: productsInCart,
      });
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

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
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

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/orders", {
      docTitle: "Your Orders",
      path: "/orders",
      hasProducts: products.length > 0,
    });
  });
};
