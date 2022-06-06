const router = require("koa-router")();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");

const { loginCheck } = require("../util");
const { SuccessModel, ErrorModel } = require("../model/resModel");
router.prefix("/api/blog");

router.get("/list", async function (ctx, next) {
  throw new Error("测试出错")
  if (ctx.query.isadmin) {
    const loginCheckRes = await loginCheck(ctx);
    if (loginCheckRes) {
      // 未登录噼噼啪啪铺铺、】、
      
      ctx.body = loginCheckRes;
      return;
    }
    // 强制查自己的博客
    ctx.query.author = ctx.session.username;
  }

  return await getList(ctx.query)
    .then((listData) => {
      if (!listData.error) {
        ctx.body = new SuccessModel(listData);
        return;
      }
      ctx.body = new ErrorModel(listData);
      return;
    })
    .catch((error) => {
      ctx.body = new ErrorModel(error);
      return;
    });
});

router.get("/detail", async (ctx, next) => {
  return await getDetail(ctx.query)
    .then((detailData) => {
      if (!detailData.error) {
        ctx.body = new SuccessModel(detailData);
        return;
      }
      ctx.body = new ErrorModel(detailData);
      return;
    })
    .catch((error) => {
      ctx.body = new ErrorModel(error);
      return;
    });
});

router.post("/new", async (ctx, next) => {
  // 登录校验
  const loginCheckRes = await loginCheck(ctx);
  if (loginCheckRes) {
    ctx.body = loginCheckRes;
    return;
  }

  ctx.request.body.author = ctx.session.username;
  return await newBlog(ctx.request.body)
    .then((newBlogData) => {
      if (!newBlogData.error) {
        ctx.body = new SuccessModel(newBlogData);
        return;
      }
      ctx.body = new ErrorModel(newBlogData);
      return;
    })
    .catch((error) => {
      ctx.body = new ErrorModel(error);
      return;
    });
});

router.post("/update", async (ctx, next) => {
  // 登录校验
  const loginCheckRes = await loginCheck(ctx);
  if (loginCheckRes) {
    ctx.body = loginCheckRes;
    return;
  }
  return await updateBlog({ ...ctx.request.body, ...ctx.query })
    .then((updateBlogData) => {
      if (!updateBlogData?.error) {
        return updateBlogData
          ? (ctx.body = new SuccessModel(updateBlogData))
          : (ctx.body = new ErrorModel(updateBlogData));
      }
      return (ctx.body = new ErrorModel(updateBlogData));
    })
    .catch((error) => {
      return (ctx.body = new ErrorModel({ error }));
    });
});

router.post("/del", async (ctx, next) => {
  // 登录校验
  const loginCheckRes = await loginCheck(ctx);
  if (loginCheckRes) {
    ctx.body = loginCheckRes;
    return;
  }

  const author = ctx.session.username;
  const id = ctx.query.id;
  console.log(author, id, 1111111);
  return await delBlog(id, author)
    .then((delBlogData) => {
      if (!delBlogData?.error) {
        return delBlogData
          ? (ctx.body = new SuccessModel(delBlogData))
          : (ctx.body = new ErrorModel(delBlogData, "删除博客失败"));
      }
      return (ctx.body = new ErrorModel(delBlogData));
    })
    .catch((error) => {
      return (ctx.body = new ErrorModel({ error }));
    });
});

module.exports = router;
