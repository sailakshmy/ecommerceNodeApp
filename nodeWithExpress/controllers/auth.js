const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(
    "request headers from getLogin",
    req.get("Cookie")?.trim()?.split("=")?.[1]
  );
  const isLoggedIn = req.get("Cookie")?.trim()?.split("=")?.[1];
  console.log("req.session", req.session, req.session.isLoggedIn);
  res.render("auth/login", {
    docTitle: "Login!",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.setHeader("Set-Cookie", "loggedIn=true");

  User.findById("68349f58c42c88be912fa7ab")
    .then((user) => {
      console.log("Found a user", user);
      // const { name, email, cart, _id } = user;
      // req.user = new User(name, email, cart, _id);
      // req.user = user;
      req.session.isLoggedIn = true;
      req.session.user = user;
      // next();
      res.redirect("/");
    })
    .catch((err) => console.log("error while finding user", err));
};
