#!/usr/bin/env node

import { terminal } from "terminal-kit";

import supportedLanguages from "./config/languages";

import fileService from "./service/file";
import locale from "./service/locale";

import { emitMessage } from "./events/messages";
import { restartEvent } from "./events/restart";
import { GridMenuResponse } from "terminal-kit/Terminal";
import translate from "./service/translate";

const appname = "Poring";

interface IQuestion extends GridMenuResponse {
  res: {
    selectedText: string;
  };
}

const service = {
  async fileInput() {
    const file = terminal.inputField().promise;

    return file;
  },

  async execute() {
    terminal.clear();

    terminal.grabInput({});

    emitMessage(`\n🐽 Hi ${appname}\n`);

    terminal.on("key", (name) => {
      if (name === "CTRL_C") {
        terminal.grabInput(false);
      }
    });

    emitMessage(`\nPlease write the JSON filename\n`);
    emitMessage(`ex: file.json\n`);

    const input = await service.fileInput();

    await fileService.getFile(input).then(async (res) => {
      fileService.state.content = res;

      if (res.message) {
        if (res.message.includes("noJSON")) {
          emitMessage("\nPlease write a valid JSON file\n");
        }

        if (res.message.includes("ENOENT")) {
          emitMessage("\nPlease write a valid filename\n");
        }

        emitMessage("\nPress Y key to restart\n");
        return restartEvent.restart();
      }

      if (!res.message) {
        emitMessage(`\n\nPlease select the source language to translate\n`);

        await locale
          .selectLanguage(supportedLanguages)
          .then(async (res: IQuestion) => {
            const { selectedText } = res;

            locale.state.sourceLanguage = selectedText;

            await locale
              .languagesToTranslate(supportedLanguages)
              .then(async () => {
                emitMessage("\nTranslating files...\n");

                await translate.prepareObjectToTranslate(
                  fileService.state.content
                );
              });
          });
      }
    });
  },
};

service.execute();

export default service;
