#!/usr/bin/env node

import { terminal } from "terminal-kit";

import supportedLanguages from "./config/languages";

import fileService from "./service/file";
import locale from "./service/locale";

import { emitMessage } from "./events/messages";

const appname = "Poring";

const service = {
  async fileInput() {
    const file = terminal.inputField().promise;

    return file;
  },

  async execute() {
    terminal.grabInput({});

    emitMessage(`\n🐽 Hi ${appname}\n`);

    terminal.on("key", (name) => {
      if (name === "CTRL_C") {
        terminal.grabInput(false);
      }
    });

    emitMessage(`\nPlease write the JSON filename\n`);

    const input = await service.fileInput();

    await fileService.getFile(input).then(async (res) => {
      const invalidFileMessage =
        "No file exists in current directory or the file must be in json";

      if (res.message !== invalidFileMessage) {
        await locale.selectLanguage(supportedLanguages);
      }
    });
  },
};

service.execute();

export default service;
