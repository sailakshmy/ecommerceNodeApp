const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
// const getDb = require("../utils/database").getDb;
// const mongodb = require("mongodb");
// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((res) => {
//         console.log("res", res);
//       })
//       .catch((e) => console.log("error while inserting product into DB", e));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log("products after fetching all products", products);
//         return products;
//       })
//       .catch((err) => console.log("error while fetching all products", err));
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(productId) }) //mongodb.BSON.ObjectId.createFromTime(productId) })
//       .next()
//       .then((product) => {
//         console.log("product from findById", product);
//         return product;
//       })
//       .catch((err) => console.log("Error while fetching product by Id", err));
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(productId) })
//       .then((res) => {
//         console.log("deleted the product successfully");
//       })
//       .catch((e) => console.log("error while deleting a product", e));
//   }
// }

// module.exports = Product;
