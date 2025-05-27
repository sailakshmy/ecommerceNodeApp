exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("page-not-found", {
      docTitle: "Page not found",
      path: "",
      isAuthenticated: req.isLoggedIn,
    });
};
