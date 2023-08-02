var parse = require("dotparser");
const fs = require("fs");

fs.readFile("./medium.dot", "utf8", (err, data) => {
  // console.log(data);
  var ast = parse(data);
  console.log(JSON.stringify(ast));
});
// var ast = parse();

// console.log(ast);

// ast is now an abstract syntax tree of an empty graph:
// [{
//   "type": "graph",
//   "children": [],
//   "id": "g"
// }]
