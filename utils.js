const sleep = (milliseconds) => {
  var t = (new Date()).getTime();
  var i = 0;
  while (((new Date()).getTime() - t) < milliseconds) {
    i++;
  }
};

export { sleep };
