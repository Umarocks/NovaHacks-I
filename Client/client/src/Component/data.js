const fs = require("fs");
const csv = require("csv-parser");

const countriesSet = new Set();
const parametersSet = new Set();

// Read the CSV file and extract unique country names and parameters
fs.createReadStream("../../../../Datasets/OWID-ENERGY-DATA.csv")
  .pipe(csv())
  .on("headers", (headers) => {
    headers.forEach((header) => {
      if (header !== "countries" && header !== "year" && header !== "iso") {
        parametersSet.add(header);
      }
    });
  })
  .on("data", (row) => {
    countriesSet.add(row["Country"]);
  })
  .on("end", () => {
    const countries = Array.from(countriesSet);
    const parameters = Array.from(parametersSet);
    const jsonData = {
      parameters: parameters,
      countries: countries,
    };

    // Write the content to data.json
    fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
      console.log(
        "data.json has been updated with the list of countries and parameters."
      );
    });
  });
