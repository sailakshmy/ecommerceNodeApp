const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const uri =
  "mongodb+srv://Groot:IAmGroot@cluster0.2ehxgue.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected!!!");
      _db = client.db();
      callback();
    })
    .catch((e) => {
      console.log("error in connecting to MongoDb", e);
      throw e;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
