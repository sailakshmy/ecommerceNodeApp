const { ValidationError } = require("sequelize");
const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  // console.log("In the middleware for add products");
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    docTitle: "Add Products",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  // This will cater only if the request type is POST
  const { title, imageUrl, description, price } = req.body;
  console.log("user", req.user);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error on add product form", errors?.array());
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Products",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl,
        description,
        price,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors?.array()?.[0]?.msg,
      validationErrors: errors?.array(),
    });
  }
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user,
  });

  // const product = new Product(
  //   title,
  //   price,
  //   imageUrl,
  //   description,
  //   null,
  //   req.user._id
  // );

  product
    .save()
    .then(() => {
      console.log("Created product from postAddProduct");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log("e from postAddProduct", e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Products",
        path: "/admin/edit-product",
        editing: editMode === "true" ? true : false,
        product: product,
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((e) => console.log("e while editing", e));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  // const product = new Product({
  //   title,
  //   price,
  //   imageUrl,
  //   description,
  //   productId,
  // });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error on add product form", errors?.array());
    return res.status(422).render("admin/edit-product", {
      docTitle: "Edit Products",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: title,
        imageUrl,
        description,
        price,
        _id: productId,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors?.array()?.[0]?.msg,
      validationErrors: errors?.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.description = description;
      product.imageUrl = imageUrl;
      product.price = price;
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })

    .catch((e) => console.log("err while saving edit", e));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  // Product.deleteById(productId)
  Product.deleteOne({ _id: productId, userId: req.user._id })
    //findByIdAndDelete(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((e) => console.log("err while deleting product from controller", e));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll()
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((products) => {
      console.log("res from getProducts in admin", products);
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((e) => console.log("error from getProducts", e));
};
