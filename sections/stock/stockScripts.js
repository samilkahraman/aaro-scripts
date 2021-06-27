const { sleep } = require("../helpers/sleep");

/**
 * @description It retrieves all the products with given parameters
 * @param {object} aaro authorized object
 * @param {object} params extra limitations like EsnekAramaKisiti="PRF.PRVU"
 * @returns {array}
 */
const getAllProducts = async (aaro, params = {}) => {
  try {
    const products = [];
    let page = 1;
    let currentPage = await aaro
      .get("Stok", {
        Sayfa: page,
        SayfaSatirSayisi: 100,
        ...params,
      })
      .then((response) => response.data);
    currentPage.Model.forEach((el) => products.push(el));

    while (currentPage.SayfalandirmaBilgisi.SonrakiSayfaVarMi) {
      page += 1;
      currentPage = await aaro
        .get("Stok", {
          Sayfa: page,
          SayfaSatirSayisi: 100,
          ...params,
        })
        .then((response) => response.data);
      currentPage.Model.forEach((el) => products.push(el));

      await sleep(200);
    }

    return products;
  } catch (err) {
    throw err;
  }
};

/**
 * @description It retrieves all the sales between two dates
 * @param {object} aaro authorized object
 * @param {string} date1 for starting date, like "2021-07-01"
 * @param {string} date2 for ending date, like "2021-07-25"
 * @param {object} TipID for sales, default 10005
 * @param {object} params extra params for limitations like DepoID:11
 * @returns {array}
 */
const getAllSales = async (aaro, date1, date2, TipID = 10005, params = {}) => {
  try {
    const sales = [];
    let page = 1;
    let currentPage = await aaro
      .get("StokHareketleri", {
        Sayfa: page,
        TarihBas: date1,
        TarihBit: date2,
        TipID,
        SayfaSatirSayisi: 100,
        ...params,
      })
      .then((response) => response.data);
    currentPage.Model.forEach((el) => sales.push(el));

    while (currentPage.SayfalandirmaBilgisi.SonrakiSayfaVarMi) {
      page += 1;
      currentPage = await aaro
        .get("StokHareketleri", {
          Sayfa: page,
          SayfaSatirSayisi: 100,
          TarihBas: date1,
          TarihBit: date2,
          TipID,
          ...params,
        })
        .then((response) => response.data);
      currentPage.Model.forEach((el) => sales.push(el));

      await sleep(200);
    }

    return sales;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getAllProducts,
  getAllSales,
};
