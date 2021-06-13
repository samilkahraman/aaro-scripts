const { sleep } = require("../helpers/sleep");

/**
 * @description It retrieves all the items in the price list
 * @param {object} aaro object
 * @param {object} params extra limitations like FiyatListesiID=84
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

/**
 * @description It removes all the passive products from a price list.
 * When you duplicate a price list and turn a product into a passive which is already in the list
 * Remains on the list. With that method you can see them.
 * @param {object} aaro authenticated object
 * @param {integer} priceListID
 * @return {array} of passive products
 */
const showPassiveItemsOnPriceList = async (aaro, priceListID) => {
  try {
    const passiveItems = [];
    const products = await getAllPriceListItems(aaro, {
      FiyatListesiID: priceListID,
    });

    const search = products.map((el) => el.StokID);
    while (search.length) {
      const partialSearch = search.splice(0, 100);
      const searchQuery = partialSearch.join(",");
      const detailedProducts = await aaro
        .get("Stok", { SayfaSatirSayisi: 100, StokID: searchQuery })
        .then((response) => response.data.Model);
      detailedProducts.forEach((product) =>
        product.Durum == false ? passiveItems.push(product) : ""
      );
    }

    return passiveItems;
  } catch (err) {
    throw err;
  }
};

const getAllPriceListItemsWithStocks = async (aaro, priceListID) => {
  const productAndStocks = [];
  const products = await getAllPriceListItems(aaro, {
    FiyatListesiID: priceListID,
  });
  while (products.length) {
    const partialSearch = products.splice(0, 10);
    const searchQuery = partialSearch.map((el) => el.StokID).join(",");
    const stockAmounts = await aaro
      .get("Stok/StokMiktarListe", {
        SayfaSatirSayisi: 100,
        StokID: searchQuery,
      })
      .then((response) => response.data.Model);
    partialSearch.forEach((product) => {
      const temporaryProduct = {};
      temporaryProduct.StokKodu = product.StokKodu;
      temporaryProduct.StokAdi = product.StokAdi;
      temporaryProduct.Fiyat = product.Fiyat;
      temporaryProduct.Depolar = {};
      stockAmounts.forEach((stock) => {
        if (stock.StokKodu == product.StokKodu) {
          temporaryProduct.Depolar[stock.DepoAdi] = {
            DepoID: stock.DepoID,
            DepoKodu: stock.DepoKodu,
            DepoAdi: stock.DepoAdi,
            Brm1ID: stock.Brm1ID,
            Brm1Kodu: stock.Brm1Kodu,
            Brm1Adi: stock.Brm1Adi,
            Miktar: stock.Miktar,
          };
        }
      });
      productAndStocks.push(temporaryProduct);
    });
  }
  return productAndStocks;
};

module.exports = {
  getAllPriceListItems,
  showPassiveItemsOnPriceList,
  getAllPriceListItemsWithStocks,
};
