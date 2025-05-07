const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  // console.log("In the middleware for add products");
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    docTitle: "Add Products",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  // This will cater only if the request type is POST
  const { title, imageUrl, description, price } = req.body;
  // const product = new Product(null, title, imageUrl, description, price);
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/products");
  //   })
  //   .catch((e) => console.log("e", e));
  Product.create({
    title,
    description,
    imageUrl,
    price,
  })
    .then((result) => {
      // res.redirect("/products");
      // console.log("result from postAddProduct", result);
      console.log("Created product from postAddProduct");
    })
    .catch((e) => console.log("e from postAddProduct", e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log("Edit mode: ", editMode);
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  // Product.findById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     docTitle: "Edit Products",
  //     path: "/admin/edit-product",
  //     editing: editMode === "true" ? true : false,
  //     product: product,
  //   });
  // });

  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Products",
        path: "/admin/edit-product",
        editing: editMode === "true" ? true : false,
        product: product,
      });
    })
    .catch((e) => console.log("e while editing", e));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  // const updatedProduct = new Product(
  //   productId,
  //   title,
  //   imageUrl,
  //   description,
  //   price
  // );
  // updatedProduct.save();
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((e) => console.log("err while saving edit", e));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("admin/products", {
  //     prods: products,
  //     docTitle: "Admin products",
  //     path: "/admin/products",
  //     hasProducts: products.length > 0,
  //     //   activeShop: true,
  //     //   productCSS: true,
  //   });
  // });
  Product.findAll()
    .then((products) => {
      console.log("res from getProducts", products);
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin products",
        path: "/admin/products",
        // hasProducts: products.length > 0,
      });
    })
    .catch((e) => console.log("error from getProducts", e));
};
