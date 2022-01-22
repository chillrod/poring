import path from "path";
import terminal from "../__mocks__/terminalkit";

import fileService from "../lib/service/file";

import supportedLanguages from "../lib/config/languages";
import locale from "../lib/service/locale";
import translate from "../lib/service/translate";

describe("Command line file", () => {
  it("should read a JS file of the directory based on the user input", async () => {
    const file = await fileService.getFile("file.json");

    expect(file).toHaveProperty("action-bar");
    expect(file).toBeTruthy();
  });

  it("should select the portuguese start option in the language object", async () => {
    const languageKeys = Object.keys(supportedLanguages);

    terminal.singleLineMenu(languageKeys, languageKeys[1], (data) => {
      expect(data).toBe("pt");
    });
  });

  it("should warn the user if no file is available on the directory or the file format is not json", () => {
    try {
      fileService.getFile("file.jss");
    } catch (err) {
      expect(err.code).toBe("ENOENT");
    }
  });

  it("should warn the user if the file exists but differs from the needed format", async () => {
    const file = await fileService.getFile("file.js");

    expect(file.message).toBe(
      "No file exists in current directory or the file must be in json"
    );
  });

  it("should parse the json structure and get the action bar key", async () => {
    const file = await fileService.getFile("file.json");

    expect(file["action-bar"]).toBe("Barra de ações");
  });

  it("should collect the remaining languages to translate", async () => {
    // selecting pt
    locale.state.sourceLanguage = "pt";

    await locale.languagesToTranslate(supportedLanguages);

    expect(locale.state.targetLanguages).toEqual(["en"]);
  });

  jest.setTimeout(15000);
  it("should translate and assign the translated value to the same key", async () => {
    await fileService.getFile("file.json");

    locale.state.sourceLanguage = "pt";

    await locale.languagesToTranslate(supportedLanguages);

    await translate.configureLanguages(fileService.state.content);
  });

  // jest.setTimeout(15000);

  // it("should translate, assign to the same key and save the file ", async () => {
  //   await fileService.getFile("file.json");

  //   service.startLanguage = "pt";

  //   const languages = service.languagesToTranslate(
  //     service.startLanguage,
  //     supportedLanguages
  //   );

  //   await service.configFileToTranslate(await languages);

  //   const obj = {};
  //   const target = {};

  //   service.content.forEach((res) => {
  //     obj[res.key] = res.translatedText;
  //     target["language"] = res.language;
  //   });

  //   await fileService.saveFile(target, obj);

  //   expect(path.join(`${__dirname}/locales/es-locale.json`)).toBeTruthy();
  // });
});
