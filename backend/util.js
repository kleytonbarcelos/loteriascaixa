exports.loterias = [
  {
    megasena:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_megase.zip",
  },
  {
    quina: "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_quina.zip",
  },
  {
    duplasena:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/d_dplsen.zip",
  },
  {
    federal:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_federa.zip",
  },
  {
    loteca: "http://www1.caixa.gov.br/loterias/_arquivos/loterias/d_loteca.zip",
  },
  {
    timemania:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_timema.zip",
  },
  {
    lotofacil:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_lotfac.zip",
  },
  {
    lotomania:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_lotoma.zip",
  },
  {
    lotogol:
      "http://www1.caixa.gov.br/loterias/_arquivos/loterias/d_lotogo.zip]",
  },
];

const fs = require("fs");
const request = require("request");
const admZip = require("adm-zip");
const cheerio = require("cheerio");

const _unzip = (fileId, destinationFolder) => {
  let zip = new admZip(fileId);
  zip.extractAllTo(destinationFolder, true);
};
exports.downloadAndUnzip = (
  url = "",
  fileOutput = `${Date.now()}.zip`,
  folderOutput = "./temp/"
) => {
  const fullPath = `${folderOutput}${fileOutput}`;
  let p = new Promise((resolve, reject) => {
    if (!fs.existsSync(folderOutput)) {
      fs.mkdirSync(folderOutput, 0744);
    }
    request
      .get(url, {
        jar: true,
      })
      .pipe(fs.createWriteStream(fullPath))
      .on("close", function () {
        _unzip(fullPath, folderOutput);
        fs.unlink(fullPath, () => {
          console.log(`File ${fileOutput} has been deleted.`);
        });
        resolve();
      })
      .on("error", (error) => {
        fs.unlink(fullPath, () => {
          console.log(`File ${fileOutput} has been deleted.`);
        });
        reject(error);
      });
  });
  return p;
};
exports.end = function () {
  console.log("The end");
};

exports.parseToFloat = (value) => {
  if (value) {
    value = value.replace(/\./g, "");
    value = value.replace(/\,/g, ".");
  }
  return parseFloat(value) == NaN ? value : parseFloat(value);
};
exports.parseToInt = (value) => {
  if (value) {
    value = value.replace(/\./g, "");
    value = value.replace(/\,/g, ".");
  }
  return parseInt(value) == NaN ? value : parseInt(value);
};

exports.readLoteria = (file) => {
  function getText(element) {
    if (element) {
      if ($(element).text()) {
        return $(element).text().trim();
      }
    }
    return undefined;
  }

  const content = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });
  const $ = cheerio.load(content);
  let trs = $("tr");
  let results = [];
  trs.each(function (index, element) {
    var tds = $(this).find("td");
    if (tds && tds.length > 0) {
      if (tds.length > 3) {
        results.push({
          concurso: getText(tds[0]),
          data: getText(tds[1]),
          bola1: getText(tds[2]),
          bola2: getText(tds[3]),
          bola3: getText(tds[4]),
          bola4: getText(tds[5]),
          bola5: getText(tds[6]),
          bola6: getText(tds[7]),
          bola7: getText(tds[8]),
          bola8: getText(tds[9]),
          bola9: getText(tds[10]),
          bola10: getText(tds[11]),
          bola11: getText(tds[12]),
          bola12: getText(tds[13]),
          bola13: getText(tds[14]),
          bola14: getText(tds[15]),
          bola15: getText(tds[16]),
          bola16: getText(tds[17]),
          bola17: getText(tds[18]),
          bola18: getText(tds[19]),
          bola19: getText(tds[20]),
          bola20: getText(tds[21]),
        });
      }
    }
  });
  return results;
};
