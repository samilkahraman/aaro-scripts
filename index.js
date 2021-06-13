const getAllProducts = require("./sections/stock/stockScripts");
const {
  getAllPriceListItems,
  showPassiveItemsOnPriceList,
  getAllPriceListItemsWithStocks,
} = require("./sections/priceList/priceListScripts");
const {
  getStocksForPriceList,
  getAllData,
} = require("./sections/combined/combinedScripts");
// const { getAllCustomers } = require("./sections/customer/customerScripts");
module.exports = {
  getAllProducts,
  getAllPriceListItems,
  showPassiveItemsOnPriceList,
  getAllPriceListItemsWithStocks,
  getStocksForPriceList,
  getAllData,
};
