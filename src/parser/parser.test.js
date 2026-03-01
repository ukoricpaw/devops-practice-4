const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { parseCsvToJson } = require("./parser");

const testDir = __dirname;
const csvPath = path.join(testDir, "test.csv");
const emptyCsvPath = path.join(testDir, "empty.csv");
const outputPath = path.join(testDir, "output.json");

beforeAll(() => {
  fs.writeFileSync(
    csvPath,
    `name,age
John,30
Jane,20`,
  );

  fs.writeFileSync(emptyCsvPath, `name,age`);
});

afterAll(() => {
  if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);
  if (fs.existsSync(emptyCsvPath)) fs.unlinkSync(emptyCsvPath);
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
});

afterEach(() => {
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
});

describe("Unit tests: parseCsvToJson", () => {
  test("1. Parses valid CSV correctly", () => {
    const result = parseCsvToJson(csvPath);

    expect(result).toEqual([
      { name: "John", age: "30" },
      { name: "Jane", age: "25" },
    ]);
  });

  test("2. Returns empty array for CSV with only headers", () => {
    const result = parseCsvToJson(emptyCsvPath);

    expect(result).toEqual([]);
  });

  test("3. Throws error if file does not exist (negative)", () => {
    expect(() => {
      parseCsvToJson("not-exists.csv");
    }).toThrow("File does not exist");
  });
});

describe("Integration tests: CLI", () => {
  test("4. CLI creates JSON file with correct content", () => {
    execSync(`node src/index.js ${csvPath} ${outputPath}`);

    const fileExists = fs.existsSync(outputPath);
    expect(fileExists).toBe(true);

    const data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

    expect(data.length).toBe(2);
    expect(data[0]).toEqual({ name: "John", age: "30" });
  });

  test("5. CLI uses default output name if not specified", () => {
    execSync(`node src/index.js ${csvPath}`);

    const defaultOutput = path.resolve("output.json");
    const exists = fs.existsSync(defaultOutput);

    expect(exists).toBe(true);

    fs.unlinkSync(defaultOutput);
  });

  test("6. CLI exits with error if input file missing (negative)", () => {
    expect(() => {
      execSync(`node src/index.js missing.csv`, { stdio: "pipe" });
    }).toThrow();
  });
});
