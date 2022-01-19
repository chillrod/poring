#!/usr/bin/env node

import { join, extname } from "path";
import { readFileSync, mkdir, writeFileSync } from "fs";

import { terminal } from "terminal-kit";
import { ILanguages, ITranslateFile } from "./dto";

import axios from "axios";

const appname = "poring";

const service = {
  languages: {
    en: "en-us",
    pt: "pt-br",
    zh: "zh-cn",
    es: "es",
  },

  loading: false,

  content: [],

  startLanguage: "",

  remainingLanguages: [],

  fileContent: {},

  sendMessage(text: string) {
    terminal.blue(text);
  },

  exitCLI() {
    terminal.grabInput(false);
  },

  async getFile(file: string) {
    try {
      if (extname(file) !== ".json") {
        throw new Error();
      }

      const fileContent = JSON.parse(
        readFileSync(join(`${(process.cwd(), file)}`), "utf-8")
      );

      service.fileContent = fileContent;

      return fileContent;
    } catch (err) {
      service.sendMessage(
        "\n\nNo file exists in current directory or the file must be in json"
      );

      service.sendMessage("\n\nPress y to start again");

      terminal.on("key", (name) => {
        if (name === "y") {
          service.execute();
        }
      });

      return new Error(
        "No file exists in current directory or the file must be in json"
      );
    }
  },

  async configFileToTranslate(languages: string[]) {
    const jsonKeys = Object.keys(service.fileContent);

    await Promise.all(
      languages.map(async (language) => {
        const keys = jsonKeys.map((key) => {
          const configuration: ITranslateFile = {
            language,
            key,
            value: service.fileContent[key],
          };

          return configuration;
        });

        await service.translateFile({
          keys,
        });

        return keys;
      })
    );
  },

  async saveFile(target: { language?: string }, file: {}) {
    const { language } = target;

    const parseFile = JSON.stringify(file);

    try {
      mkdir("./locales", { recursive: true }, () => {
        writeFileSync(
          `${process.cwd()}/locales/${language}-locale.json`,
          parseFile
        );
      });
    } finally {
      terminal.blue(`\n\n${language?.toUpperCase()} File translated`);
    }

    return {
      target,
      parseFile,
    };
  },

  async translateFile({ keys }) {
    try {
      await Promise.all(
        keys.map(async (key) => {
          const {
            data: { translatedText },
          } = await axios.post(
            "https://translate.argosopentech.com/translate",
            "",
            {
              params: {
                q: key.value,
                source: service.startLanguage,
                target: key.language,
              },
            }
          );

          return {
            translatedText,
            key: key.key,
            language: key.language,
          };
        })
      ).then(async (res) => {
        service.content = res;

        const obj = {};
        const target = {};

        res.forEach((res) => {
          obj[res.key] = res.translatedText;
          target["language"] = res.language;
        });

        await service.saveFile(target, obj);

        return res;
      });
    } catch (err) {
      throw new Error(err);
    }
  },

  async languagesToTranslate(startLanguage: string, languages: ILanguages) {
    terminal.blue("\n\n👽 Translating files...");

    const keys = Object.keys(languages);

    const translateKeys = keys.filter((key) => key !== startLanguage);

    service.remainingLanguages = translateKeys;

    if (process.env.NODE_ENV !== "test") {
      await service.configFileToTranslate(translateKeys);
    }

    return translateKeys;
  },

  async selectLanguage(languages: ILanguages) {
    const parseLanguages = Object.keys(languages);
    terminal.blue("\n\nplease select the current language of the JSON file\n");

    terminal.gridMenu(parseLanguages, async (err, res) => {
      service.startLanguage = res.selectedText;

      await service.languagesToTranslate(
        service.startLanguage,
        service.languages
      );

      terminal.grabInput(false);

      return res;
    });

    return service.startLanguage;
  },

  async fileInput() {
    const file = terminal.inputField().promise;

    return file;
  },

  async execute() {
    terminal.grabInput({});

    terminal.blue(`🐽 hey!\nwelcome to ${appname}.json\n`);

    terminal.blue(`\nplease provide the locale json file name\n`);

    const input = await service.fileInput();

    await service.getFile(input).then(async (res) => {
      const invalidFileMessage =
        "No file exists in current directory or the file must be in json";

      if (res.message !== invalidFileMessage) {
        await service.selectLanguage(service.languages);
      }
    });
  },
};

service.execute();

export default service;
