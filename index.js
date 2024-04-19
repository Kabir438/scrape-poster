const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4001;

app.get("/scrape", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  scrapeLogic(res); 
});

app.get("/", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const language = req.query.language;
  const promoter = req.query.promoter;
  const download = !!req.query.download;
 
  // console.log(req)
  return await scrapeLogic(res, language, promoter, download);
});
 
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});