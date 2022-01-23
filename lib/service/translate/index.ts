import axios from "axios";

import fileService from "../file";
import locale from "../locale";

import { flatten, unflatten } from "flat";
import { emitMessage, randomTranslatedMessage } from "../../events/messages";
import { terminal } from "terminal-kit";

const translate = {
  state: {
    flatten: {},
    translatedContent: {},
    shallowFlatten: {},
  },
  flattenFile(file) {
    return flatten(file);
  },
  unflattenFile(file) {
    return unflatten(file);
  },
  async prepareObjectToTranslate(file) {
    const flattened = translate.flattenFile(file);

    translate.state.flatten = flattened;

    for (const language of locale.state.targetLanguages) {
      const lastItem = locale.state.targetLanguages.slice(-1);

      await translate.keyTranslate(language).then(() => {
        randomTranslatedMessage(language);

        if (lastItem[0] === language) {
          emitMessage(`\n\n🌈  Thank you!\n`);

          terminal.on("key", (name) => {
            if (name === "CTRL_C") {
              terminal.grabInput(false);
            }
          });
        }

        fileService.saveFile(language, translate.state.translatedContent);
      });
    }
  },

  async keyTranslate(language) {
    const configuration = Object.keys(translate.state.flatten);

    for (const key of configuration) {
      await translate.execute({
        key,
        value: translate.state.flatten[key],
        language,
      });
    }
  },

  async execute(key) {
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

        return (translate.state.translatedContent[key.key] = translatedText);
      })
      .catch((err) => {
        return err;
      });
  },
};

export default translate;
