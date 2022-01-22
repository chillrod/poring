import axios from "axios";

import fileService from "../file";
import locale from "../locale";

const translate = {
  state: {
    obj: {},
  },
  async configureLanguages(content) {
    const fileContent = Object.keys(content);

    for (const language of locale.state.targetLanguages) {
      const keys = fileContent.map((key) => {
        return {
          key,
          value: fileService.state.content[key],
          language,
        };
      });

      await translate.parseJSON({ keys });
    }
  },

  async parseJSON({ keys }) {
    for (const key of keys) {
      if (typeof key.value !== "object") {
        await translate.libreService(key);
      }

      if (typeof key.value === "object") {
        translate.parseNestedJSON(key);
      }
    }
  },

  parseNestedJSON(key) {
    if (!translate.state.obj[key.key]) translate.state.obj[key.key] = {};

    const asyncKeys = Object.keys(key.value);

    const nestedKeys = asyncKeys.map((newKey) => {
      return {
        higherKey: key.key,
        key: newKey,
        value: key.value[newKey],
        language: key.language,
      };
    });

    translate.parseJSON({ keys: nestedKeys });
  },

  async libreService(key) {
    await axios
      .post("https://translate.argosopentech.com/translate", "", {
        params: {
          q: key.value,
          source: locale.state.sourceLanguage,
          target: key.language,
        },
      })
      .then((res) => {
        const {
          data: { translatedText },
        } = res;

        if (key.higherKey) {
          return (translate.state.obj[key.higherKey][key.key] = translatedText);
        }

        translate.state.obj[key.key] = translatedText;

        return {
          key: key.key,
          value: translatedText,
          language: key.language,
        };
      })
      .catch((err) => {
        throw new Error("Failed to translate");
      });
  },
};

export default translate;
