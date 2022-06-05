function func1(next) {
  return function (action) {
    action = action * 2;
    console.log("1开始");
    next(action);
    console.log("1结束");
  };
}

function func2(next) {
  return function (action) {
    action = action + 20;
    console.log("2开始");
    next(action);
    console.log("2结束");
    action = action + 1112;
  };
}

function func3(next) {
  return function (action) {
    action = action / 4;
    console.log("3开始");
    next(action);
    console.log("3结束");
  };
}

let comp = [func1, func2, func3].reduce(
  (a, b) =>
    (...args) =>
      a(b(...args))
)((action) => console.log(action));

comp(6);
