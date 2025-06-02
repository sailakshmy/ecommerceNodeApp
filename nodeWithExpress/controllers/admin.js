// const { ValidationError } = require("sequelize");
const Product = require("../models/product");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const deleteFileHelper = require("../utils/file").deleteFile;
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
  const { title, description, price } = req.body;
  const image = req.file;
  // console.log("user", req.user, req.file);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Products",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        description,
        price,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error on add product form", errors?.array());
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Products",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        description,
        price,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors?.array()?.[0]?.msg,
      validationErrors: errors?.array(),
    });
  }

  const imageUrl = image.path;
  const product = new Product({
    // _id: new mongoose.Types.ObjectId("683b159e554b4554d0559364"),
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
    .catch((e) => {
      console.log("e from postAddProduct", e);
      // throw new Error(e);
      // return res.status(500).render("admin/edit-product", {
      //   docTitle: "Add Products",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl,
      //     description,
      //     price,
      //   },
      //   isAuthenticated: req.session.isLoggedIn,
      //   errorMessage: "Database operation failed",
      //   validationErrors: [],
      // });
      // res.redirect("/500");
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((e) => {
      console.log("e while editing", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, description, price } = req.body;
  const image = req.file;
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
      if (image) {
        deleteFileHelper(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.price = price;
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })

    .catch((e) => {
      console.log("err while saving edit", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId, imageUrl } = req.body;
  // Product.deleteById(productId)
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found!"));
      }
      deleteFileHelper(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    //findByIdAndDelete(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((e) => {
      console.log("err while deleting product from controller", e);
      next(e);
    });
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
    .catch((e) => {
      console.log("error from getProducts", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};
