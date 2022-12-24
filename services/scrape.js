const config = require("../config/config.json");
const chererio = require("cheerio");
const axios = require("axios");

module.exports.getPriceFeed = async function getPriceFeed() {
  const siteUrl = config.SCRAPE_URL;
  const { data } = await axios({
    method: "GET",
    url: siteUrl,
  });
  // throw new Error("Ooops"); To check error handeling
  return scrapeData(data, 9);
};

function scrapeData(data, numberToScrape) {
  const keys = [
    "rank",
    "name",
    "price",
    "24h",
    "7d",
    "marketCap",
    "volume",
    "cirulatingSupply",
  ];
  const coinArr = [];

  const $ = chererio.load(data);

  $(config.SCRAPE_SELECTOR).each((parentIndex, parentElm) => {
    let keyIndex = 0;
    const coinObj = {};

    if (parentIndex <= numberToScrape) {
      $(parentElm)
        .children()
        .each((childIndex, childElm) => {
          let value = $(childElm).text();

          console.log(value)
          console.log(keyIndex)

          if (keyIndex === 1 || keyIndex === 6) {
            value = $("p:first-child", $(childElm).html()).text();
          }

          if (value) {
            coinObj[keys[keyIndex]] = value;
            keyIndex++;
          }
        });
      coinArr.push(coinObj);
    }
  });
  return coinArr;
}
