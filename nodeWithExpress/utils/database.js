// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "IAmGroot123",
// });

// module.exports = pool.promise();

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("node-complete", "root", "IAmGroot123", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const uri =
  "mongodb+srv://Groot:IAmGroot@cluster0.2ehxgue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected!!!");
      callback(client);
    })
    .catch((e) => console.log("error in connecting to MongoDb", e));
};

module.exports = mongoConnect;
