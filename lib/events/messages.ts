import { terminal } from "terminal-kit";

export const emitMessage = (text: string) => {
  return terminal.brightYellow(text);
};
