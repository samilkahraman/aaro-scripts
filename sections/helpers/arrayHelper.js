// Array.prototype.diff = function (arr2) {
//   return this.filter((x) => !arr2.includes(x));
// };
const diff = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));

module.exports = {
  diff,
};
