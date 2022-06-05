const { ErrorModel } = require("../model/resModel");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const crypto = require("crypto");

const getPostData = (req) => {
  return new Promise((res, rej) => {
    if (req.method !== "POST") {
      res({});
      return;
    }

    if (req.headers["content-type"] !== "application/json") {
      res({});
      return;
    }

    let postData = "";

    req.on("data", (chunk) => {
      postData += chunk.toString();
    });

    req.on("end", () => {
      if (!postData) {
        res({});
        return;
      }
      res(JSON.parse(postData));
    });
  });
};

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

const loginCheck = async (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel(false, "尚未登录"));
  }
};

const writeLog = (writeStream, log) => {
  writeStream.write(log + "\n");
};

const createWriteStream = (fileName) => {
  const fullFilePath = path.resolve(__dirname, "../logs/", fileName);
  const writeStream = fs.createWriteStream(fullFilePath, {
    flags: "a",
  });
  return writeStream;
};

const accessWriteStream = createWriteStream("access.log");

// 访问日志方法
const access = (log) => {
  writeLog(accessWriteStream, log);
};

const accessLogFilePath = path.resolve(__dirname, "../logs/", "access.log");

const readStream = fs.createReadStream(accessLogFilePath);

const rl = readline.createInterface({
  input: readStream,
});

let chromeNum = 0;

let totalNum = 0;

rl.on("line", (lineData) => {
  if (!lineData) return;
  // 记录总行数
  totalNum++;

  const arr = lineData.split(" -- ");

  if (arr[2] && arr[2].indexOf("Chrome") > 0) {
    // 累加chrome计数
    chromeNum++;
  }
});

// 监听读取完成
rl.on("close", () => {
  console.log("chrome 占比", `${((chromeNum / totalNum) * 100).toFixed(0)}%`);
});

// 密匙
const SECRET_KEY = "Neeklw_221391_!&%#$0021..!!";

// md5
const md5 = (content) => {
  const md5Instance = crypto.createHash("md5");
  return md5Instance.update(content).digest("hex");
};

const genPassword = (password) => {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
};

module.exports = {
  getPostData,
  getCookieExpires,
  loginCheck,
  access,
  genPassword
};
