import translate from "../../lib/service/translate";
import fileService from "../../lib/service/file";
import locale from "../../lib/service/locale";
import supportedLanguages from "../../lib/config/languages";
import { existsSync } from "fs";

describe("Translate", () => {
  it("should flatten the object received", async () => {
    await fileService.getFile("file.json").then(async (res) => {
      fileService.state.content = res;

      const flattened = translate.flattenFile(fileService.state.content);

      expect(flattened).toBeDefined();
    });
  });

  it("should unflatten the object received", async () => {
    await fileService.getFile("file.json").then(async (res) => {
      fileService.state.content = res;

      const flattened = translate.flattenFile(fileService.state.content);

      const unflatted = translate.unflattenFile(flattened);

      expect(unflatted).toHaveProperty("actions.donate-again");
    });
  });

  jest.setTimeout(25000);

  it("should flatten the object and return the flattened version with the key, values and language translated ", async () => {
    await fileService.getFile("file.json").then(async (res) => {
      fileService.state.content = res;

      locale.state.sourceLanguage = "pt";

      await locale.languagesToTranslate(supportedLanguages);

      await translate.prepareObjectToTranslate(fileService.state.content);

      expect(existsSync(process.cwd() + "/locales/en-locale.json")).toBe(true);
      expect(existsSync(process.cwd() + "/locales/zh-locale.json")).toBe(true);
    });
  });
});
