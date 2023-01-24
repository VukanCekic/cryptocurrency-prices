const express = require("express");
const scrape = require("./services/scrape");
const config = require("./config/config.json");

const app = express();

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

app.set("view engine", "ejs");

app.get("", async (req, res) => {
  try {
    const arr = await scrape.getPriceFeed();
    res.status(200).render("price-feed", { top10: arr });
  } catch (err) {
    res.status(500).render("error");
  }
});

app.listen(process.env.PORT || config.PORT, () => {
  console.log(`started on port ${process.env.PORT || config.PORT}`);
});
