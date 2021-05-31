const getAllProducts = require("./sections/stock/stockScripts");
const {
  getAllPriceListItems,
  showPassiveItemsOnPriceList,
  getAllPriceListItemsWithStocks,
} = require("./sections/priceList/priceListScripts");
const getStocksForPriceList = require("./sections/combined/combinedScripts");

module.exports = {
  getAllProducts,
  getAllPriceListItems,
  getAllPriceListItemsWithStocks,
  getStocksForPriceList,
  showPassiveItemsOnPriceList,
};
