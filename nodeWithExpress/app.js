const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;

const User = require("./models/user");

// const db = require("./utils/database");
// const sequelize = require("./utils/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.2ehxgue.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();
dotenv.config();
const store = new MongoDbStore({
  uri,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  )
    cb(null, true);
  else cb(null, false);
};

const csrfProtection = csrf();
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

app.set("view engine", "ejs");

app.set("views", "views");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(helmet());
app.use(compression());
app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

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
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error("Dummy new");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error("Dummy");
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("err while finding user by Id", err);
      // throw new Error(err);
      next(new Error(err));
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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    docTitle: "Error Occurred",
    path: "/500",
    isAuthenticated: req?.session?.isLoggedIn,
  });
});

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

    app.listen(process.env.PORT || 3000);
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000);
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
