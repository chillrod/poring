import { stdin, stdout } from "process";
import path from "path";
import fs from "fs";
import FormData from "form-data";

import readline from "../__mocks__/readline";
import axios from "../__mocks__/axios";
import terminal from "../__mocks__/terminalkit";

interface TranslateForm extends HTMLFormElement {
  q: string;
  source: string;
  target: string;
  format: string;
}

describe("Command line file", () => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  const baseURL = "https://translate.argosopentech.com/translate";

  const getFile = (file) => {
    const readfile = terminal.input(file, (data) => {
      return fs.readFileSync(path.join(__dirname, data), "utf-8");
    });

    return readfile;
  };

  it("should read a JS file of the directory based on the user input", async () => {
    const file = getFile("file.json");

    expect(file).toBeTruthy();
  });

  it("should parse the json structure and get the action bar key", () => {
    const file = getFile("file.json");

    const parsed = JSON.parse(file);

    expect(parsed["action-bar"]).toBe("Barra de ações");
  });

  it("should warn the user if no file is available on the directory", () => {
    try {
      const file = getFile("file2.js");

      return file;
    } catch (err) {
      // this is the code that returns if node can't find a file in the directory
      expect(err.code).toBe("ENOENT");
    }
  });

  it("should warn the user if the file exists but differs from the needed format", () => {
    const file = getFile("file.js");

    try {
      const checkfile = path.extname(file);
      file;
      if (checkfile !== ".json")
        throw new Error("The given file must be in JSON");
    } catch (err) {
      expect(err.message).toBe("The given file must be in JSON");
    }
  });

  it("should parse and translate a single key of the file", async () => {
    const file = getFile("file.json");

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
    const file = getFile("file.json");

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
