const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const db = require("./utils/database");

const app = express();

db.execute("SELECT * FROM  products")
  .then((res) => {
    console.log("res", res[0], res[1]);
  })
  .catch((err) => {
    console.log("err", err);
  });

app.set("view engine", "ejs");

app.set("views", "views");

app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
