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
  req.session.isLoggedIn = true;
  res.redirect("/");
};
