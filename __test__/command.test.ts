import path from "path";
import fs from "fs";
import FormData from "form-data";

import axios from "../__mocks__/axios";
import terminal from "../__mocks__/terminalkit";

interface TranslateForm extends HTMLFormElement {
  q: string | string[];
  source: string;
  target: string;
  format: string;
}

const param: TranslateForm = <TranslateForm>{
  q: "",
  source: "pt",
  target: "en",
  format: "text",
};

describe("Command line file", () => {
  const baseURL = "https://translate.argosopentech.com/translate";

  const formData = (x) => new FormData(x);

  const getFile = (file) => {
    const readfile = terminal.input(file, (data) => {
      return fs.readFileSync(path.join(__dirname, data), "utf-8");
    });

    return readfile;
  };

  const _mapValues = async (
    content: string[],
    translate: ({ value, key }) => void
  ) => {
    const contentKeys = Object.keys(content);

    const obj: any = {};

    await Promise.all(
      contentKeys.map(async (key) => {
        const value = translate({ value: content[key], key });

        return value;
      })
    ).then((values) => {
      // maybe i can separate this function to another function? hm
      values.forEach((value) => {
        const key = value["key"];

        const translatedValue = value["translatedText"];

        obj[key] = translatedValue;
      });
    });

    return JSON.stringify(obj);
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
      if (checkfile !== ".json")
        throw new Error("The given file must be in JSON");
    } catch (err) {
      expect(err.message).toBe("The given file must be in JSON");
    }
  });

  it("should parse and translate a single key of the file", async () => {
    const file = getFile("file.json");

    const parsed = JSON.parse(file);

    const shallowParam = {
      ...param,
      q: parsed["action-bar"],
    };

    await axios.post(baseURL, formData(shallowParam), (data) => {
      const { translatedText } = data;

      expect(translatedText).toBe("stock bar");
    });
  });

  it("should translate and assign the translated value to the same key", async () => {
    const fileName = "file.json";

    const file = getFile(fileName);

    const fileContent = JSON.parse(file);

    const translateValues = async ({ value, key }: any) => {
      const shallowParam = {
        ...param,
        q: value,
      };

      const translate = await axios.mPost(
        formData(shallowParam),
        "es",
        (data) => {
          const {
            data: { translatedText },
          } = data;

          return {
            key,
            translatedText,
          };
        }
      );

      return translate;
    };

    // this function map, translate, and assign the translated values to the json object keys
    const translatedValues = await _mapValues(fileContent, translateValues);

    expect(translatedValues).toMatchSnapshot();

    expect(translatedValues).toContain("action-bar");
  });

  fit("should translate and create the language file related to the given file", async () => {
    const fileName = "file.json";
    const language = "zh";

    const file = getFile(fileName);

    const fileContent = JSON.parse(file);

    const translateValues = async ({ value, key }: any) => {
      const shallowParam = {
        ...param,
        q: value,
      };

      const translate = await axios.mPost(
        formData(shallowParam),
        language,
        (data) => {
          const {
            data: { translatedText },
          } = data;

          return {
            key,
            translatedText,
          };
        }
      );

      return translate;
    };

    const translatedValues = await _mapValues(fileContent, translateValues);

    fs.writeFileSync(`${__dirname}/${language}-${fileName}`, translatedValues);

    expect(getFile(`${language}-${fileName}`)).toBeTruthy();
  });
});
