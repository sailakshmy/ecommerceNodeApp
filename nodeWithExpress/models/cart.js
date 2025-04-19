const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndx = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndx];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndx] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const currentCart = { ...JSON.parse(fileContent) };
      // Analyze the cart => Find existing product
      const existingProduct = currentCart.products.find(
        (prod) => prod.id === id
      );
      currentCart.totalPrice -= existingProduct.qty * productPrice;
      currentCart.products = currentCart.products.filter(
        (prod) => prod.id !== id
      );

      fs.writeFile(p, JSON.stringify(currentCart), (err) => {
        console.log(err);
      });
    });
  }
};
