const fs = require("fs");
const path = require("path");
const { parseCsvToJson } = require("./parser");

const testFilePath = path.join(__dirname, "test.csv");

beforeAll(() => {
  const csvContent = `name,age
    John,30
    Jane,25`;

  fs.writeFileSync(testFilePath, csvContent);
});

afterAll(() => {
  fs.unlinkSync(testFilePath);
});

describe("parseCsvToJson", () => {
  test("parses CSV into JSON correctly", () => {
    const result = parseCsvToJson(testFilePath);

    expect(result).toEqual([
      { name: "John", age: "30" },
      { name: "Jane", age: "25" },
    ]);
  });

  test("throws error if file does not exist", () => {
    expect(() => {
      parseCsvToJson("non-existing-file.csv");
    }).toThrow("File does not exist");
  });
});
