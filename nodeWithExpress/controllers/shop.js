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
  // Product.findById(prodId)
  //   .then(([row]) => {
  //     res.render("shop/product-detail", {
  //       docTitle: row?.[0].title,
  //       product: row?.[0],
  //       path: "/products",
  //     });
  //   })
  //   .catch((e) => console.log("err", e));
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       docTitle: product.title,
  //       product: product,
  //       path: "/products",
  //     });
  //   })
  //   .catch((e) => console.log("err", e));

  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render("shop/product-detail", {
        docTitle: products?.[0].title,
        product: products?.[0],
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
  // console.log("req.user.cart", req.user.cart);
  req.user
    .getCart()
    .then((cart) => {
      console.log("cart", cart);
      return cart
        .getProducts()
        .then((products) => {
          console.log("Products in getProducts from getCart", products);
          res.render("shop/cart", {
            docTitle: "Your cart",
            path: "/cart",
            products: products,
          });
        })
        .catch((err) => {
          console.log("error in getProducts from getCart", err);
        });
    })
    .catch((err) => console.log("error in getCart", err));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((allProducts) => {
  //     const productsInCart = [];
  //     for (const product of allProducts) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         productsInCart.push({
  //           productData: product,
  //           qty: cartProductData.qty,
  //         });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       docTitle: "Your cart",
  //       path: "/cart",
  //       products: productsInCart,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: prodId,
        },
      });
    })
    .then((products) => {
      let product;
      if (products?.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log("err in postCart", err));
  // console.log("object", prodId);
  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
  // res.render("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      const product = products?.[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch();
  // Product.findById(productId, (product) => {
  //   Cart.deleteProduct(productId, product.price);
  //   res.redirect("/cart");
  // });
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
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      console.log("Products in postOrder", products);
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = {
                quantity: product.cartItem.quantity,
              };
              return product;
            })
          );
        })
        .then(() => fetchedCart.setProducts(null))
        .then((result) => {
          res.redirect("/orders");
        })
        .catch((e) => console.log("Err in createOrder from postOrder", e));
    })
    .catch((e) => console.log("err in postOrder", e));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log("orders from getOrders", orders);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders: orders,
        // hasProducts: products.length > 0,
      });
    })
    .catch((e) => console.log("err in getOrders", e));
};
