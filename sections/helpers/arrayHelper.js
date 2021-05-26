Array.prototype.diff = function (arr2) {
  return this.filter((x) => !arr2.includes(x));
};
