import { existsSync, rmSync } from "fs";
import { join } from "path";
import fileService from "../../lib/service/file";

describe("File Service", () => {
  it("should read a file", async () => {
    const file = await fileService.getFile("file.json");

    expect(file).toHaveProperty("action-bar");
  });

  it("should warn if file differs from json format", async () => {
    await fileService.getFile("file.js").then((res) => {
      expect(res.message).toContain("noJSON");
    });
  });

  it("should warn if no file exists in the directory", async () => {
    await fileService.getFile("file2.json").then((res) => {
      expect(res.message).toContain("ENOENT");
    });
  });

  it("should stringify the file", async () => {
    const file = await fileService.getFile("file.json");

    const stringify = fileService.stringifyFile(file);

    expect(stringify).toContain("action-bar");
  });

  it("should create a new locale folder if no folder is available", async () => {
    if (existsSync(process.cwd() + "/locales")) {
      rmSync(join(process.cwd() + "/locales"), { recursive: true });
    }

    await fileService.folderMiddleware();

    expect(existsSync(process.cwd() + "/locales")).toBe(true);
  });

  it("should save the file with the language prefix", async () => {
    const file = await fileService.getFile("file.json");

    await fileService.saveFile("en", file);

    expect(existsSync(process.cwd() + "/locales/en-locale.json")).toBe(true);
  });
});
