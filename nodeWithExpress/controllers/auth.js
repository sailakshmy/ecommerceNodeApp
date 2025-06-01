const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

const sendgridTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const { combineTableNames } = require("sequelize/lib/utils");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  console.log(
    "request headers from getLogin",
    req.get("Cookie")?.trim()?.split("=")?.[1]
  );

  console.log("req.session", req.session, req.session.isLoggedIn);
  let error = req.flash("error");
  if (error.length > 0) {
    error = error?.[0];
  } else error = null;
  res.render("auth/login", {
    docTitle: "Login!",
    path: "/login",
    errorMessage: error,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      docTitle: "Login!",
      path: "/login",
      errorMessage: errors.array()?.[0]?.msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          docTitle: "Login!",
          path: "/login",
          errorMessage: "Invalid credentials!",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((passwordsMatch) => {
          if (passwordsMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          } else {
            return res.status(422).render("auth/login", {
              docTitle: "Login!",
              path: "/login",
              errorMessage: "Invalid credentials!",
              oldInput: {
                email: email,
                password: password,
              },
              validationErrors: [],
            });
          }
        })
        .catch((err) => {
          console.log("Error while comparing passwords", err);
          return res.redirect("/login");
        });
    })
    .catch((e) => {
      console.log(e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });

  // req.isLoggedIn = true;
  // res.setHeader("Set-Cookie", "loggedIn=true");

  // User.findById("68349f58c42c88be912fa7ab")
  //   .then((user) => {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     req.session.save((err) => {
  //       console.log(err);
  //       res.redirect("/");
  //     });
  //   })
  //   .catch((err) => console.log(err));
  // .then((user) => {
  //   console.log("Found a user from postLogin", user);
  //   // const { name, email, cart, _id } = user;
  //   // req.user = new User(name, email, cart, _id);
  //   // req.user = user;
  //   req.session.isLoggedIn = true;
  //   req.session.user = user;
  //   req.session.save(() => res.redirect("/"));
  //   // next();
  //   // res.redirect("/");
  // })

  // .catch((err) => console.log("error while finding user", err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("Error logged during logout", err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error?.[0];
  } else error = null;
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: false,
    errorMessage: error,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(
      "errors from the validation result in postSignUp",
      errors.array()
    );
    return res.status(422).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      isAuthenticated: false,
      errorMessage: errors.array()?.[0]?.msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  // User.findOne({ email: email })
  //   .then((userDoc) => {
  //     if (userDoc) {
  //       req.flash("error", "Email already exists!");
  //       return res.redirect("/signup");
  //     }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: {
          items: [],
        },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "sailakshmy94@hotmail.com",
        subject: "Signup successful!",
        html: "<h1>You have successfully signed up to an ecommerce application built using Node and Express with MongoDb and Mongoose.</h1>",
      });
    })
    .catch((e) => {
      console.log("error while fetching existing user in postsignup", e);
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getResetPassword = (req, res, next) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error?.[0];
  } else error = null;
  res.render("auth/reset", {
    docTitle: "Reset password",
    path: "/reset",
    errorMessage: error,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(
        "error while generating random token in postResetPassword",
        err
      );
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const { email } = req.body;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with the email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        return transporter.sendMail({
          to: email,
          from: "sailakshmy94@hotmail.com",
          subject: "Reset password",
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a>to set a new password</p>`,
        });
      })
      .catch((e) => {
        console.log("error while retrieving user", e);
        const err = new Error(e);
        err.httpStatusCode = 500;
        return next(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
  })
    .then((user) => {
      let error = req.flash("error");
      if (error.length > 0) {
        error = error?.[0];
      } else error = null;
      res.render("auth/new-password", {
        docTitle: "New password",
        path: "/new-password",
        errorMessage: error,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((e) => {
      console.log(
        "Error while fetching a user with resetToken and resetTokenExpiration in getNewPassword",
        e
      );
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((e) => {
      console.log(
        "Error while fetching user with id, resetToken and resetTokenExpiration in postnewPassword",
        e
      );
      const err = new Error(e);
      err.httpStatusCode = 500;
      return next(err);
    });
};
