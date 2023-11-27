import fs from "fs/promises";
import { getPath } from "./Helpers";
import { Backend } from "./Backend";
import { Frontend } from "./Frontend";

export class WaveSafe {
  frontend: Frontend;
  backend: Backend;

  consoleToggleItem: any;

  constructor(backend: Backend, frontend: Frontend) {
    this.frontend = frontend;
    this.backend = backend;

    this.addOptions();
  }

  addOptions() {
    const intervall = this.frontend.tray.item("Intervall");

    intervall.add(
      this.frontend.tray.item("onChange", {
        checked: true,
      }),
      this.frontend.tray.item("30 sec"),
      this.frontend.tray.item("1 min"),
      this.frontend.tray.item("2 min"),
    );

    this.consoleToggleItem = this.frontend.tray.item("Show Console", {
      checked: false,
      action: () => this.toggleConsole(),
    });

    const quit = this.frontend.tray.item("Quit", () =>
      this.frontend.tray.kill(),
    );
    this.frontend.tray.setMenu(
      intervall,
      this.frontend.tray.separator(),
      this.consoleToggleItem,
      quit,
    );
  }

  toggleConsole() {
    this.backend.visible ? this.hideConsole() : this.showConsole();
  }

  hideConsole() {
    this.backend.hide();
    this.consoleToggleItem.checked = false;
    console.log("Console: hidden");
  }

  showConsole() {
    this.backend.show();
    this.consoleToggleItem.checked = true;
    console.log("Console: visible");
  }

  toggleActivation() {
    this.backend.visible ? this.deactivate() : this.activate();
    console.log(`State: ${this.backend.visible ? "running" : "stopped"}`);
  }

  async activate() {
    this.frontend.tray.setIcon(await fs.readFile(getPath("public/active.png")));
    this.frontend.tray.notify("WaveSafe", "RUNNING");
  }

  async deactivate() {
    this.frontend.tray.setIcon(
      await fs.readFile(getPath("public/inactive.png")),
    );
    this.frontend.tray.notify("WaveSafe", "STOPPED");
  }
}
