const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const dotenv = require("dotenv");

const User = require("./models/user");

// const db = require("./utils/database");
// const sequelize = require("./utils/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const uri =
  "mongodb+srv://Groot:IAmGroot@cluster0.2ehxgue.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
dotenv.config();
const store = new MongoDbStore({
  uri,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");

app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret:
      "secret key that is expected to be a long string value but it can be anything apparently",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("err while finding user by Id", err);
      throw new Error(err);
    });
});

// app.use((req, res, next) => {
//   console.log("request session", req.session);
//   if (req.session.user) {
//     console.log("req.session.user", req.session.user);
//     User.findById(req.session.user._id)
//       .then((user) => {
//         console.log("Found a user", user);
//         // const { name, email, cart, _id } = user;
//         // req.user = new User(name, email, cart, _id);
//         req.user = user;
//         next();
//       })
//       .catch((err) => console.log("error while finding user", err));
//   }
// User.findByPk(1)
//   .then((user) => {
//     req.user = user;
//     next();
//   })
//   .catch((err) => console.log(err));
//   next();
// });

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get500);
app.use(errorController.get404);

mongoose
  .connect(uri)
  .then(() => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const newUser = new User({
    //       name: "abc",
    //       email: "abc@test.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     newUser.save();
    //   }
    // });

    app.listen(3000);
  })
  .catch((e) => console.log("error while connecting to mongoose", e));

// mongoConnect(() => {
//   app.listen(3000);
// });

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
