import { terminal } from "terminal-kit";

export const emitMessage = (text: string) => {
  return terminal.brightCyan(text);
};

export const randomTranslatedMessage = (language) => {
  const upper = language.toUpperCase();

  const messages = [
    `\n\nš  ${upper} translated!...`,
    `\n\nš“  Done!! ${upper} has been translated!...`,
    `\n\nš  Nice! ${upper} has been saved in locales folder!...`,
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return emitMessage(randomMessage);
};
