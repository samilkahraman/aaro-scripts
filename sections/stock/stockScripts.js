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

exports.getAllProducts = getAllProducts;
