const getAllProducts = require("../stock/stockScripts");
const getAllPriceListItems = require("../priceList/priceListScripts");
require("../helpers/arrayHelper");

/**
 * @description It retrieves all the items on the given list, search stock with params and finds differences
 * @description sample price list have PRF.PRV.1,PRF.PRV.2 and stocks also have PRF.PRV.7 which has more than 30 stocks.
 * @description This method finds and return PRF.PRV.7
 * @param {object} aaro object
 * @param {number} FiyatListesiID price list ID
 * @param {object} params limitations for search like EsnekAramaKisiti="PRF.PRVU"
 * @param {object} biggerThan retrieve only if Miktar>0
 * @returns {array} of differences between price list items and stocks
 */
const getStocksForPriceList = async (
  aaro,
  FiyatListesiID,
  params,
  biggerThan = 0
) => {
  try {
    const priceListItems = await getAllPriceListItems(aaro, { FiyatListesiID });
    const products = await getAllProducts(aaro, params);

    const filteredProducts = products
      .filter((prd) => prd.Miktar != null && prd.Miktar > biggerThan)
      .map((el) => el.StokKodu);

    const filteredPriceListItems = priceListItems.map((el) => el.StokKodu);

    const difference = filteredProducts.diff(filteredPriceListItems);

    return products.filter((prd) => difference.includes(prd.StokKodu));
  } catch (err) {
    throw err;
  }
};

module.exports = getStocksForPriceList;
