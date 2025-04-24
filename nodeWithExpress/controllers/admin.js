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
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/products");
    })
    .catch((e) => console.log("e", e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log("Edit mode: ", editMode);
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Products",
      path: "/admin/edit-product",
      editing: editMode === "true" ? true : false,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      //   activeShop: true,
      //   productCSS: true,
    });
  });
};
