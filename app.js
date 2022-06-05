const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const path = require("path");
const fs = require("fs");
const morgan = require("koa-morgan");

const { REDIS_CONF } = require("./conf/db");

const index = require("./routes/index");
const users = require("./routes/users");
const blog = require("./routes/blog");
const user = require("./routes/user");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// morgan配置
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  const logFileName = path.resolve(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a",
  });
  app.use(
    morgan("combined", {
      stream: writeStream,
    })
  );
}

// session 配置
app.keys = ["su718_uwAHd02176ewudh_8jki"];
app.use(
  session({
    // 配置cookie
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    // 配置redis
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`,
    }),
  })
);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
