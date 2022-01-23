import { extname, join } from "path";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import translate from "../translate";

const fileService = {
  state: {
    content: {},
    translatedContent: {},
  },

  stringifyFile(file) {
    return JSON.stringify(file);
  },

  async extMiddleware(file) {
    if (extname(file) !== ".json") {
      return new Error("noJSON");
    }

    return file;
  },

  async folderMiddleware() {
    if (!existsSync(join(process.cwd() + "/locales"))) {
      return mkdirSync(process.cwd() + "/locales");
    }
  },

  async getFile(file: string) {
    const result = fileService
      .extMiddleware(file)
      .then((res) =>
        JSON.parse(readFileSync(join(`${(process.cwd(), res)}`), "utf-8"))
      )
      .catch((err) => {
        return new Error(err);
      });

    return result;
  },

  async saveFile(language, file: {}) {
    const parsedFile = fileService.stringifyFile(translate.unflattenFile(file));

    await fileService.folderMiddleware().then((res) => {
      writeFileSync(
        `${process.cwd()}/locales/${language}-locale.json`,
        parsedFile
      );
    });

    return parsedFile;
  },
};

export default fileService;
