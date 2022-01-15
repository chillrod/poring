import { stdin, stdout } from "process";
import path from "path";
import fs from "fs";
import FormData from "form-data";

import readline from "../__mocks__/readline";
import axios from "../__mocks__/axios";

interface TranslateForm extends HTMLFormElement {
  q: string;
  source: string;
  target: string;
  format: string;
}

describe("Command line test", () => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  const givenFile = (file) =>
    rl.question(file, (data) => {
      return data;
    });

  const baseURL = "https://translate.argosopentech.com/translate";

  const filePath = (file) => path.join(__dirname, file);

  it("should read a JS file of the directory based on the user input", async () => {
    const file = fs.readFileSync(filePath(givenFile("test.json")), "utf-8");

    expect(file).toBeTruthy();
  });

  it("should parse the json structure and get the action bar key", () => {
    const file = fs.readFileSync(filePath(givenFile("test.json")), "utf-8");

    const parsed = JSON.parse(file);

    expect(parsed["action-bar"]).toBe("Barra de ações");
  });

  fit("should warn the user if no file is available on the directory", () => {
    try {
      const file = fs.readFileSync(filePath(givenFile("test.js")), "utf-8");

      return file;
    } catch (err) {
      // this is the code that returns if node can't find a file in the directory
      expect(err.code).toBe("ENOENT");
    }
  });

  it("should parse and translate a single key of the file", async () => {
    const file = fs.readFileSync(filePath(givenFile("test.json")), "utf-8");

    const parsed = JSON.parse(file);

    const param: TranslateForm = <TranslateForm>{
      q: parsed["action-bar"],
      source: "pt",
      target: "en",
      format: "text",
    };

    const formData = new FormData(param);

    await axios.post(baseURL, formData, (data) => {
      const { translatedText } = data;

      expect(translatedText).toBe("stock bar");
    });
  });

  it("should assign the translated value to the same key", async () => {
    const file = fs.readFileSync(filePath(givenFile("test.json")), "utf-8");

    const parsed = JSON.parse(file);

    const param: TranslateForm = <TranslateForm>{
      q: parsed,
      source: "pt",
      target: "en",
      format: "text",
    };

    const formData = new FormData(param);

    await axios.post(baseURL, formData, (data) => {
      const { translatedText } = data;

      const parsed = JSON.parse(JSON.stringify(translatedText));

      expect(parsed).toMatchSnapshot();
    });
  });
});
