const fs = require("fs");
const { parse } = require("csv-parse/sync");

function parseCsvToJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records;
}

module.exports = { parseCsvToJson };
