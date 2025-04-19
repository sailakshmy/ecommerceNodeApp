exports.get404 = (req, res, next) => {
  // console.log("Reached the 404 handler");
  // res.status(404).send("Page not found");
  // res.status(404).sendFile(path.join(rootDir, "views", "page-not-found.html"));
  res
    .status(404)
    .render("page-not-found", { docTitle: "Page not found", path: "" });
};
