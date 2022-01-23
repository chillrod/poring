import { terminal } from "terminal-kit";

export const emitMessage = (text: string) => {
  return terminal.brightCyan(text);
};

export const randomTranslatedMessage = (language) => {
  const upper = language.toUpperCase();

  const messages = [
    `\n\n👀  ${upper} translated!...`,
    `\n\n🌴  Done!! ${upper} has been translated!...`,
    `\n\n🌈  Nice! ${upper} has been saved in locales folder!...`,
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return emitMessage(randomMessage);
};
