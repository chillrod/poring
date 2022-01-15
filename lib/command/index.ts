import { terminal } from "terminal-kit";

terminal.grabInput({});

export const greetings = async () => {
  terminal.brightMagenta(`if-localizer v0.1\n`);

  terminal.blue(`\nHi! Please provide the filename \n`);

  const input = await terminal.inputField().promise;

  terminal.blue(`\nTranslating files of ${input}`);


  return input;
};



