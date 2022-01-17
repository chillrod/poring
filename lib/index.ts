import { join, extname } from "path";
import { readFileSync } from "fs";

import { terminal } from "terminal-kit";
import { ILanguages } from "./dto";
import axios from "axios";

const cli = {
  primary: terminal.blue(),
};

const appname = "kirby";

const service = {
  languages: {
    en: "en-us",
    pt: "pt-br",
    zh: "zh-cn",
    es: "es",
  },

  fileContent: {},

  sendMessage(text: string) {
    cli.primary(text);
  },

  exitCLI() {
    terminal.grabInput(false);
  },

  getFile(file: string) {
    try {
      if (extname(file) !== ".json") {
        throw new Error();
      }

      const fileContent = JSON.parse(
        readFileSync(join(__dirname, file), "utf-8")
      );

      service.fileContent = fileContent;

      return fileContent;
    } catch (err) {
      service.sendMessage(
        "\n\nNo file exists in current directory or the file must be in json"
      );

      service.exitCLI();

      return "error";
    }
  },

  async translateFile({ source, target }) {
    try {
      const {
        data: { translatedText },
      } = await axios.post(
        "https://translate.argosopentech.com/translate",
        "",
        {
          params: {
            q: service.fileContent["action-bar"],
            source,
            target,
          },
        }
      );

      return translatedText;
    } catch (err) {
      // not tested yet
      return err;
    }
  },

  async languagesToTranslate(startLanguage: string, languages: ILanguages) {
    const keys = Object.keys(languages);

    const translateKeys = keys.filter((key) => {
      if (key !== startLanguage) {
        service.translateFile({ source: startLanguage, target: key });
        return key;
      }
    });

    return translateKeys;
  },

  async selectLanguage(languages: string[]) {
    cli.primary("\n\nplease select the current language of the JSON file\n");

    terminal.gridMenu(languages, async (err, res) => {
      await service.languagesToTranslate(res.selectedText, service.languages);
    });
  },

  async fileInput() {
    const file = terminal.inputField().promise;

    return file;
  },

  async execute() {
    terminal.grabInput({});

    cli.primary(`🐽 hey!\nwelcome to ${appname}.json\n`);

    cli.primary(`\nplease provide the locale json file name\n`);

    const languages = Object.keys(service.languages);

    const input = await service.fileInput();

    await service.getFile(input);

    await service.selectLanguage(languages);
  },
};

service.execute();

export default service;
