const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  throw new Error("Invalid Arguments");
};
try {
  console.log(sum(1));
} catch (e) {
  console.log("Error occurred");
  //   console.log("e", e);
}

// console.log(sum(1));
console.log("this works");
