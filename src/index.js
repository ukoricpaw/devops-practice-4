const fs = require("fs");
const path = require("path");
const { parseCsvToJson } = require("./parser/parser");

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "output.json";

if (!inputPath) {
  console.error("Usage: node src/index.js <input.csv> <output.json>");
  process.exit(1);
}

try {
  const absoluteInputPath = path.resolve(inputPath);
  const absoluteOutputPath = path.resolve(outputPath);

  const jsonData = parseCsvToJson(absoluteInputPath);

  fs.writeFileSync(absoluteOutputPath, JSON.stringify(jsonData, null, 2));

  console.log(`JSON successfully written to ${absoluteOutputPath}`);
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
