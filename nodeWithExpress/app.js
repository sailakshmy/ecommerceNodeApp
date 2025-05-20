const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database");

// const db = require("./utils/database");
// const sequelize = require("./utils/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");

app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

// // Sequelize Associations
// Product.belongsTo(User, {
//   constraints: true,
//   onDelete: "CASCADE",
// });
// // A user can have many products
// User.hasMany(Product);

// // A user can have one cart
// User.hasOne(Cart);
// Cart.belongsTo(User);

// // A Cart can belong to many Products
// Cart.belongsToMany(Product, { through: CartItem });

// // A product can belong to multiple carts
// Product.belongsToMany(Cart, { through: CartItem });

// // A user can have many orders
// User.hasMany(Order);
// Order.belongsTo(User);

// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then((result) => {
//     // console.log("res", result);
//     // app.listen(3000);
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     console.log("user before", user);
//     if (!user) {
//       // Creating a dummy user
//       return User.create({ name: "abc", email: "abc@test.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     // Creating a dummy cart
//     return user.createCart();
//     // console.log("user", user);
//   })
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch((e) => {
//     console.log("e", e);
//   });
