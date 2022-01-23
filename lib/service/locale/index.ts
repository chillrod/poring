import { terminal } from "terminal-kit";
import { ILanguages } from "../../dto";

import supportedLanguages from "../../config/languages";

const locale = {
  state: {
    sourceLanguage: "",
    targetLanguages: [],
  },
  async selectLanguage(languages: ILanguages) {
    const parseLanguages = Object.keys(languages);
    return terminal.gridMenu(parseLanguages).promise;
  },

  async languagesToTranslate(languages: ILanguages) {
    const keys = Object.keys(languages);

    const translateKeys = keys.filter(
      (key) => key !== locale.state.sourceLanguage
    );

    locale.state.targetLanguages = translateKeys;

    return locale.state.targetLanguages;
  },
};

export default locale;
