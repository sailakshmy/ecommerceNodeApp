const bcrypt = require("bcryptjs");

const User = require("../models/user");

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
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid credentials!");
        return res.redirect("/login");
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
            req.flash("error", "Invalid credentials!");
            return res.redirect("/login");
          }
        })
        .catch((err) => {
          console.log("Error while comparing passwords", err);
          return res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));

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
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: {
            items: [],
          },
        });
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((e) =>
      console.log("error while fetching existing user in postsignup", e)
    );
};
