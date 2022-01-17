import path from "path";
import fs from "fs";
import FormData from "form-data";

import maxios from "../__mocks__/maxios";
import terminal from "../__mocks__/terminalkit";

import service from "../lib";

describe("Command line file", () => {
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
    const file = service.getFile("file.json");

    expect(file).toBeTruthy();
  });

  it("should select the portuguese start option in the language object", async () => {
    const languages = { en: "en-us", pt: "pt-br", zh: "zh-cn", es: "es" };

    const languageKeys = Object.keys(languages);

    terminal.singleLineMenu(languageKeys, "pt", (data) => {
      expect(data).toBe("pt");
    });
  });

  it("should warn the user if no file is available on the directory or the file format is not json", () => {
    try {
      service.getFile("file.jss");
    } catch (err) {
      expect(err.code).toBe("ENOENT");
    }
  });

  it("should warn the user if the file exists but differs from the needed format", async () => {
    const file = await service.getFile("file.js");

    expect(file).toEqual("error");
  });

  it("should parse the json structure and get the action bar key", async () => {
    const file = await service.getFile("file.json");

    expect(file["action-bar"]).toBe("Barra de ações");
  });

  it("should collect the remaining languages to translate", async () => {
    const languages = Object.keys(service.languages);

    // selecting pt
    const translate = await service.languagesToTranslate(
      languages[1],
      service.languages
    );

    expect(translate).toEqual(["en", "zh", "es"]);
  });

  it("should parse and translate a single key of the file", async () => {
    await service.getFile("file.json");

    const pt = "pt";

    const en = "en";

    const translatedText = await service.translateFile({
      source: pt,
      target: en,
    });

    expect(translatedText).toBe("stock bar");
  });

  it("should translate and assign the translated value to the same key", async () => {
    await service.getFile("file.json");

    const pt = "pt";

    const en = "en";

    const translateValues = await service.translateFile({
      source: pt,
      target: en,
    });

    // const translateValues = async ({ value, key }: any) => {
    //   const shallowParam = {
    //     ...param,
    //     q: value,
    //   };

    //   const translate = await axios.mPost(
    //     formData(shallowParam),
    //     "es",
    //     (data) => {
    //       const {
    //         data: { translatedText },
    //       } = data;

    //       return {
    //         key,
    //         translatedText,
    //       };
    //     }
    //   );

    //   return translate;
    // };

    // this function map, translate, and assign the translated values to the json object keys
    // const translatedValues = await _mapValues(fileContent, translateValues);

    // expect(translatedValues).toMatchSnapshot();

    // expect(translatedValues).toContain("action-bar");
  });

  // it.skip("should translate and create the language file related to the given file", async () => {
  //   const fileName = "file.json";
  //   const language = "zh";

  //   const file = getFile(fileName);

  //   const fileContent = JSON.parse(file);

  //   const translateValues = async ({ value, key }: any) => {
  //     const shallowParam = {
  //       ...param,
  //       q: value,
  //     };

  //     const translate = await axios.mPost(
  //       formData(shallowParam),
  //       language,
  //       (data) => {
  //         const {
  //           data: { translatedText },
  //         } = data;

  //         return {
  //           key,
  //           translatedText,
  //         };
  //       }
  //     );

  //     return translate;
  //   };

  //   const translatedValues = await _mapValues(fileContent, translateValues);

  //   fs.writeFileSync(`${__dirname}/${language}-${fileName}`, translatedValues);

  //   expect(getFile(`${language}-${fileName}`)).toBeTruthy();
  // });
});
