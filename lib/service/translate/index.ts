import axios from "axios";

import fileService from "../file";
import locale from "../locale";

const translate = {
  state: {
    translateContent: {},
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

      await translate.libreService({ keys });
    }
  },

  async libreService({ keys }) {
    for (const key of keys) {
      const {
        data: { translatedText },
      } = await axios
        .post("https://translate.argosopentech.com/translate", "", {
          params: {
            q: key.value,
            source: locale.state.sourceLanguage,
            target: key.language,
          },
        })
        .catch(() => {
          throw new Error("Failed to translate");
        });
    }
  },
};

export default translate;
