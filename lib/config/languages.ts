// this is the config that serves the current supported languages
// an collect the remaining languages

const supportedLanguages = {
  en: "en-us",
  pt: "pt-br",
  zh: "zh-cn",
  es: "es",
};

const testLanguages = {
  en: "en-us",
  pt: "pt-br",
  zh: "zh-cn",
};

const checkNodeEnv = process.env.NODE_ENV === "test";

export default checkNodeEnv ? testLanguages : supportedLanguages;
