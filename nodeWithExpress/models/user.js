const getDb = require("../utils/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
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
