import path from "path";
import terminal from "../__mocks__/terminalkit";

import service from "../lib";
import { ILanguages } from "../lib/dto";

describe("Command line file", () => {
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

    expect(file.message).toBe(
      "No file exists in current directory or the file must be in json"
    );
  });

  it("should parse the json structure and get the action bar key", async () => {
    const file = await service.getFile("file.json");

    expect(file["action-bar"]).toBe("Barra de ações");
  });

  it("should collect the remaining languages to translate", async () => {
    const languages = Object.keys(service.languages);

    // selecting pt
    await service.languagesToTranslate(languages[1], service.languages);

    expect(service.remainingLanguages).toEqual(["en", "zh", "es"]);
  });

  jest.setTimeout(15000);
  it("should translate and assign the translated value to the same key", async () => {
    await service.getFile("file.json");

    service.startLanguage = "pt";

    const supportedLanguages: ILanguages = service.languages;

    const languages = service.languagesToTranslate(
      service.startLanguage,
      supportedLanguages // get only en
    );

    await service.configFileToTranslate(await languages);

    const obj = {};
    const target = {};

    service.content.forEach((res) => {
      obj[res.key] = res.translatedText;
      target["language"] = res.language;
    });

    const saveFile = await service.saveFile(target, obj);

    expect(saveFile.parseFile).toContain("action-bar");
  });

  jest.setTimeout(15000);

  it("should translate, assign to the same key and save the file ", async () => {
    await service.getFile("file.json");

    service.startLanguage = "pt";

    const supportedLanguages: ILanguages = service.languages;

    const languages = service.languagesToTranslate(
      service.startLanguage,
      supportedLanguages
    );

    await service.configFileToTranslate(await languages);

    const obj = {};
    const target = {};

    service.content.forEach((res) => {
      obj[res.key] = res.translatedText;
      target["language"] = res.language;
    });

    await service.saveFile(target, obj);

    expect(path.join(`${__dirname}/locales/es-locale.json`)).toBeTruthy();
  });
});
