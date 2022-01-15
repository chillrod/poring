import path from "path";

import fs from "fs";

import readline from "../__mocks__/readline";
import { stdin, stdout } from "process";

describe("Command line test", () => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  const givenFile = rl.question("Whats the name of the file?", (data) => {
    return data;
  });

  const filePath = (file) => path.join(__dirname, file);

  it("should read a JS file of the directory based on the user input", async () => {
    const file = fs.readFileSync(filePath(givenFile), "utf-8");

    expect(file).toBeTruthy();
  });

  it("should parse the json structure and get the action bar key", () => {
    const file = fs.readFileSync(filePath(givenFile), "utf-8");

    const parsed = JSON.parse(file);

    expect(parsed["action-bar"]).toBe("Barra de ações");
  });

  it("should warn the user if the file is invalid", () => {
    const wrongFormatFile = rl.wrongfile(
      "Whats the name of the file",
      (data) => {
        return data;
      }
    );


    try {
      const checkfile = path.extname(wrongFormatFile);

      if (checkfile !== ".json")
        throw new Error("The given file must be in JSON");
    } catch (err) {
      console.log("🚀 ~ file: command.test.ts ~ line 49 ~ it ~ err", err)
      expect(err)
    }
  });

  it.todo(
    "should instruct the user that the file needed must be in json format"
  );

  it.todo("should let the user select the base language to translate");
});
