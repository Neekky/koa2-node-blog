const Koa = require("./lib/koa2/like-koa2");
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  console.log("洋葱1层 开始")
  console.log(next, "123123")
  await next();
  console.log("洋葱1层 结束")
  const rt = ctx["X-Response-Time"];
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  console.log("洋葱2层 开始")
  const start = Date.now();
  await next();
  console.log("洋葱2层 结束")
  const ms = Date.now() - start;
  ctx["X-Response-Time"] = `${ms}ms`;
});

// response

app.use(async (ctx) => {
  console.log("洋葱3层 开始")
  console.log("洋葱3层 结束")
  ctx.response.end("Hello World");
});

app.listen(3000);
