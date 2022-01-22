import { extname, join } from "path";

import { mkdir, readFileSync, writeFileSync } from "fs";

import { terminal } from "terminal-kit";

import { emitMessage } from "../../events/messages";
import service from "../..";

const fileService = {
  state: {
    content: {},
    translatedContent: {},
  },

  async getFile(file: string) {
    try {
      if (extname(file) !== ".json") {
        throw new Error();
      }

      const fileContent = JSON.parse(
        readFileSync(join(`${(process.cwd(), file)}`), "utf-8")
      );

      fileService.state.content = fileContent;

      return fileContent;
    } catch (err) {
      emitMessage(
        "\n\nNo file exists in current directory or the file must be in json"
      );

      emitMessage("\n\nPress y to start again");

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
      emitMessage(`\n\n${language?.toUpperCase()} File translated`);
    }

    return {
      target,
      parseFile,
    };
  },
};

export default fileService;
