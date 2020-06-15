const express = require("express");
const app = express();
const util = require("./util");

app.get("/", (req, res) => {
  util
    .downloadAndUnzip(
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_lotoma.zip"
    )
    .then(() => {
      const response = util.readLoteria("./temp/d_lotman.htm");
      console.log(response);
      return res.json(response.splice(-20));
    });
});
app.listen(3333, () => {
  console.log("Server started");
});
