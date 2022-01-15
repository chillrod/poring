import { stdin, stdout } from "process";
import path from "path";
import fs from "fs";
import FormData from "form-data";

import readline from "../__mocks__/readline";
import axios from "../__mocks__/axios";

// const maxios = jest.mocked(axios, true);

describe("Command line test", () => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  const givenFile = rl.question("", (data) => {
    return data;
  });

  const baseURL = "https://libretranslate.de/translate";

  const filePath = (file) => path.join(__dirname, file);

  it("should read a JS file of the directory based on the user input", async () => {
    const file = fs.readFileSync(filePath(givenFile), "utf-8");

    expect(file).toBeTruthy();
  });

  it("should parse the json structure and get the action bar key", () => {
    const file = fs.readFileSync(filePath(givenFile), "utf-8");

    const parsed = JSON.parse(file);

    expect(parsed["action-bar"]).toBe("Barra de ações");
  });

  it("should warn the user if the file is invalid", () => {
    const wrongFormatFile = rl.wrongfile("", (data) => {
      return data;
    });

    try {
      const checkfile = path.extname(wrongFormatFile);

      if (checkfile !== ".json")
        throw new Error("The given file must be in JSON");
    } catch (err) {
      expect(err.message).toBe("The given file must be in JSON");
    }
  });

  fit("should parse and translate a single key of the file", async () => {
    const file = fs.readFileSync(filePath(givenFile), "utf-8");

    const parsed = JSON.parse(file);

    interface TranslateForm extends HTMLFormElement {
      q: string;
      source: string;
      target: string;
      format: string;
    }

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
});
