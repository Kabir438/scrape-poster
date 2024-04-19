const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4001;

app.get("/scrape", (req, res) => {
  scrapeLogic(res); 
});

app.get("/", async (req, res) => {
  const language = req.query.language;
  const promoter = req.query.promoter;
  const download = !!req.query.download;
 
  // console.log(req)
  return await scrapeLogic(res, language, promoter, download);
});
 
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});