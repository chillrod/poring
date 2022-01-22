import { terminal } from "terminal-kit";
import { ILanguages } from "../../dto";

import supportedLanguages from "../../config/languages";

import { emitMessage } from "../../events/messages";
import translate from "../translate";
import fileService from "../file";

const locale = {
  state: {
    sourceLanguage: "",
    targetLanguages: [],
  },
  async selectLanguage(languages: ILanguages) {
    const parseLanguages = Object.keys(languages);

    emitMessage("\n\nPlease select the source language of the JSON file\n");

    terminal.gridMenu(parseLanguages, async (err, res) => {
      locale.state.sourceLanguage = res.selectedText;

      await locale.languagesToTranslate(supportedLanguages);

      terminal.grabInput(false);

      return res;
    });

    return locale.state.sourceLanguage;
  },

  async languagesToTranslate(languages: ILanguages) {
    emitMessage("\n\n👽 Translating files...");

    const keys = Object.keys(languages);

    const translateKeys = keys.filter(
      (key) => key !== locale.state.sourceLanguage
    );

    locale.state.targetLanguages = translateKeys;

    if (process.env.NODE_ENV !== "test") {
      await translate.configureLanguages(fileService.state.content);
    }

    return locale.state.targetLanguages;
  },
};

export default locale;
