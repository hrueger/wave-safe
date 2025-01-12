import {
  timeout,
  getPath,
  getImageAsAscii,
  isAlreadyRunning,
} from "./modules/Helpers";
import { Frontend } from "./modules/Frontend";
import { Backend } from "./modules/Backend";
import { WaveSafe } from "./modules/WaveSafe";

import path from "path";
import fs from "fs";
const packageJSON = JSON.parse(
  fs.readFileSync(getPath("package.json")).toString(),
);

import { initStorage, storage } from "./modules/Storage";

(async () => {
  await initStorage();

  if (process.env.NODE_ENV != "development") {
    console.log("Checking if already running...");
    if (await isAlreadyRunning()) {
      console.log("Already running! Exiting...");
      await timeout(1000);
      process.exit(1);
    }
  }

  console.log("Starting WaveSafe...");

  if (process.env.NODE_ENV != "development") {
    console.log(
      await getImageAsAscii(getPath("public/idle.png"), {
        width: 28,
        height: 28,
      }),
    );
    await timeout(200);
  }

  console.log(`WaveSafe version ${packageJSON.version} started!`);

  if (process.env.NODE_ENV != "development") await timeout(1000);

  const App = new WaveSafe(
    new Backend(),
    await new Frontend().initialize({
      title: "WaveSafe",
      iconPath: getPath("public/idle.png"),
      action: () => onTrayIconClick(),
      useTempDir: true,
    }),
  );

  function onTrayIconClick() {
    App.toggleActivation();
  }
})();
