const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "logData.txt");
console.log(1)

// 读取文件
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data.toString());
});
console.log(2)
 
// 写入文件

fs.writeFile()