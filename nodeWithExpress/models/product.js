const getDb = require("../utils/database").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((res) => {
        console.log("res", res);
      })
      .catch((e) => console.log("error while inserting product into DB", e));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("products after fetching all products", products);
        return products;
      })
      .catch((err) => console.log("error while fetching all products", err));
  }
}

module.exports = Product;

// const fs = require("fs");
// const path = require("path");
// const rootDir = require("../utils/path");
// const db = require("../utils/database");
// const Cart = require("./cart");

// const p = path.join(rootDir, "data", "products.json");

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       return cb([]);
//     }
//     cb(JSON.parse(fileContent));
//   });
// };
// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//   save() {
//     // getProductsFromFile((products) => {
//     //   if (this.id) {
//     //     const existingProductIndex = products.findIndex(
//     //       (prod) => prod.id === this.id
//     //     );
//     //     const updatedProducts = [...products];
//     //     updatedProducts[existingProductIndex] = this;
//     //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     products.push(this);
//     //     fs.writeFile(p, JSON.stringify(products), (err) => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });
//     return db.execute(
//       "INSERT INTO products (title, price,imageUrl, description) VALUES (?,?,?,?)",
//       [this.title, this.price, this.imageUrl, this.description]
//     );
//   }

//   static deleteById() {
//     // getProductsFromFile((products) => {
//     //   // easier logic
//     //   const productToBeDeleted = products.find((p) => p.id === id);
//     //   const updatedProducts = products.filter((p) => p.id !== id);
//     //   fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //     if (!err) {
//     //       Cart.deleteProduct(id, productToBeDeleted.price);
//     //     }
//     //     console.log(err);
//     //   });
//     //   // my logic
//     //   // const product = products.find((p) => p.id === id);
//     //   // if (!product) {
//     //   //   return;
//     //   // }
//     //   // const updatedProducts = products.filter((p) => p.id !== id);
//     //   // fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //   //   console.log(err);
//     //   // });
//     // });
//   }

//   static fetchAll() {
//     // getProductsFromFile(cb);
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     // getProductsFromFile((products) => {
//     //   const product = products.find((p) => p.id === id);
//     //   cb(product);
//     // });
//     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
//   }
// };

// const Sequelize = require("sequelize");

// const sequelize = require("../utils/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Product;
