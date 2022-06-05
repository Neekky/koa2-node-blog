const router = require("koa-router")();

const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

router.prefix("/api/user");

router.post("/login", async function (ctx, next) {
  console.log(ctx.request.body, "body is")
  return await login(ctx.request.body)
    .then((loginCheckData) => {
      if (!loginCheckData?.error && loginCheckData.username) {
        ctx.session.username = loginCheckData.username;
        ctx.session.realname = loginCheckData.realname;
        console.log(loginCheckData, "loginCheckData is")
        ctx.body = new SuccessModel(loginCheckData)
        return;
      }
      return (ctx.body = new ErrorModel(loginCheckData, "登录失败"));
    })
    .catch((error) => {
      return (ctx.body = new ErrorModel({ error }, "登录失败"));
    });
});

module.exports = router;
