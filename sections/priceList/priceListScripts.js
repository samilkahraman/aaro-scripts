const { sleep } = require("../helpers/sleep");

/**
 * @description It retrieves all the items in the price list
 * @param {object} aaro object
 * @param {object} params extra limitations like EsnekAramaKisiti="PRF.PRVU"
 * @returns {array}
 */
const getAllPriceListItems = async (aaro, params = {}) => {
  try {
    const products = [];
    let page = 1;
    let currentPage = await aaro
      .get("FiyatListesiSatirlar", {
        Sayfa: page,
        SayfaSatirSayisi: 100,
        ...params,
      })
      .then((response) => response.data);
    currentPage.Model.forEach((el) => products.push(el));

    while (currentPage.SayfalandirmaBilgisi.SonrakiSayfaVarMi) {
      page += 1;
      currentPage = await aaro
        .get("FiyatListesiSatirlar", {
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

module.exports = getAllPriceListItems;
