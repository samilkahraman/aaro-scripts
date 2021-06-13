const getAllProducts = require("../stock/stockScripts");
const { getAllPriceListItems } = require("../priceList/priceListScripts");
const { diff } = require("../helpers/arrayHelper");
const { sleep } = require("../helpers/sleep");

/**
 * @description It retrieves all the items on the given list, search stock with params and finds differences
 * @description sample price list have PRF.PRV.1,PRF.PRV.2 and stocks also have PRF.PRV.7 which has more than 30 stocks.
 * @description This method finds and return PRF.PRV.7
 * @description Sample:  const items = await getStocksForPriceList(aaro,292,{ EsnekAramaKisiti: "PRF.KASA" },30);
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

    const difference = diff(filteredProducts, filteredPriceListItems);

    return products.filter((prd) => difference.includes(prd.StokKodu));
  } catch (err) {
    throw err;
  }
};

/**
 * @description It retrieves all the data for given end point and parameters
 * @param {object} aaro object
 * @param {string} endpoint may be Stok, Cari etc.
 * @param {object} params limitations for search like EsnekAramaKisiti="PRF.PRVU"
 * @returns {array} of items
 */
const getAllData = async (aaro, endpoint, params) => {
  try {
    const items = [];
    let page = 1;
    let currentPage = await aaro
      .get(endpoint, {
        Sayfa: page,
        SayfaSatirSayisi: 100,
        ...params,
      })
      .then((response) => response.data);
    currentPage.Model.forEach((el) => items.push(el));
    console.log(currentPage.SayfalandirmaBilgisi);
    while (currentPage.SayfalandirmaBilgisi.SonrakiSayfaVarMi) {
      page += 1;
      currentPage = await aaro
        .get(endpoint, {
          Sayfa: page,
          SayfaSatirSayisi: 100,
          ...params,
        })
        .then((response) => response.data);
      currentPage.Model.forEach((el) => items.push(el));

      await sleep(200);
    }

    return items;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStocksForPriceList,
  getAllData,
};
