const getDb = require("../utils/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items:[]}
    this._id = id;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    const cartProductIndex = this.cart.items.findIndex((cartItem) => {
      console.log("productId", product?._id, "cartItem", cartItem);
      return product?._id.toString() === cartItem?.productId.toString();
    });
    const updatedCartItems = [...this.cart.items];
    let updatedQuantity = 1;
    if (cartProductIndex >= 0) {
      updatedQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = updatedQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: updatedQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    // return this.cart;
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) =>
        products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            )?.quantity,
          };
        })
      );
  }

  deleteProductFromCart(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId?.toString()
    );
    return db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      {
        $set: {
          cart: { items: updatedCartItems },
        },
      }
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;

// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING,
// });

// module.exports = User;
