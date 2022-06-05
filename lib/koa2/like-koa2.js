const http = require("http");

const compose = (middlewareList) => {
  return (ctx) => {
    const dispatch = (i) => {
      try {
        const fn = middlewareList[i];
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return dispatch(0);
  };
};

const composeplus = (funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  const result = funcs.reduce((a,b)=> async(...args) => Promise.resolve(b(a(...args))));
  console.log(result, "result is");
  return result;
};

class LikeKoa2 {
  constructor() {
    this.middlewareList = [];
  }

  use(fn) {
    this.middlewareList.push(fn);
    return this;
  }

  createContext(request, response) {
    const ctx = {
      request,
      response,
    };
    ctx.query = request.query;
    return ctx;
  }

  handleRequest(ctx, fn) {
    return fn(ctx);
  }

  callback() {
    const fn = compose(this.middlewareList);

    return (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = LikeKoa2;
