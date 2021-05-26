const getAllProducts = require("./sections/stock/stockScripts");
const getAllPriceListItems = require("./sections/priceList/priceListScripts");
const getStocksForPriceList = require("./sections/combined/combinedScripts");

module.exports = {
  getAllProducts,
  getAllPriceListItems,
  getStocksForPriceList,
};
