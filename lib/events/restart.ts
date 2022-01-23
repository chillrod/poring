import { terminal } from "terminal-kit";

import service from "..";

export const restartEvent = {
  async restart() {
    terminal.on("key", (name) => {
      if (name === "y") {
        terminal.grabInput(false);
        service.execute();
      }
    });
  },
};
