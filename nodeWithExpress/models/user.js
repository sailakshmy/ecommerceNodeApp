const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: updatedQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteProductFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId?.toString()
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../utils/database").getDb;
// const mongodb = require("mongodb");

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items:[]}
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex((cartItem) => {
//       console.log("productId", product?._id, "cartItem", cartItem);
//       return product?._id.toString() === cartItem?.productId.toString();
//     });
//     const updatedCartItems = [...this.cart.items];
//     let updatedQuantity = 1;
//     if (cartProductIndex >= 0) {
//       updatedQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = updatedQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: updatedQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     // return this.cart;
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => item.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) =>
//         products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item.productId.toString() === product._id.toString()
//             )?.quantity,
//           };
//         })
//       );
//   }

//   deleteProductFromCart(productId) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId?.toString()
//     );
//     return db.collection("users").updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       {
//         $set: {
//           cart: { items: updatedCartItems },
//         },
//       }
//     );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db.collection("users").updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           {
//             $set: {
//               cart: { items: [] },
//             },
//           }
//         );
//       })
//       .catch((e) => console.log("error while creating an order", e));
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray()
//       .catch((e) => console.log("error while fetching orders", e));
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) });
//   }
// }

// module.exports = User;
