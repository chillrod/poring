import locale from "../../lib/service/locale";

import supportedLanguages from "../../lib/config/languages";

import terminal from "../../__mocks__/terminalkit";

describe("Locale", () => {
  it("should select the portuguese start option in the language object", async () => {
    const languageKeys = Object.keys(supportedLanguages);

    terminal.singleLineMenu(languageKeys, languageKeys[1], (data) => {
      locale.state.sourceLanguage = data;
    });

    expect(locale.state.sourceLanguage).toBe("pt");
  });

  it("should collect the remaining languages to translate", async () => {
    // selecting pt
    locale.state.sourceLanguage = "pt";

    await locale.languagesToTranslate(supportedLanguages);

    expect(locale.state.targetLanguages).toEqual(["en", "zh"]);
  });
});
