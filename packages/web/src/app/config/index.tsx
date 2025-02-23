import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { Webapp } from "@xliic/common/webapp/config";

import { initStore } from "./store";
import { createListener } from "./listener";

import { makeWebappMessageHandler } from "../webapp";
import ThemeStyles from "../../features/theme/ThemeStyles";
import { ThemeState, changeTheme } from "../../features/theme/slice";
import {
  loadConfig,
  showPlatformConnectionTest,
  showOverlordConnectionTest,
} from "../../features/config/slice";
import Config from "./Config";

const messageHandlers: Webapp["webappHandlers"] = {
  changeTheme,
  loadConfig,
  showPlatformConnectionTest,
  showOverlordConnectionTest,
};

function App() {
  return (
    <>
      <ThemeStyles />
      <Config />
    </>
  );
}

function renderWebView(host: Webapp["host"], theme: ThemeState) {
  const store = initStore(createListener(host), theme);

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );

  window.addEventListener("message", makeWebappMessageHandler(store, messageHandlers));
}

(window as any).renderWebView = renderWebView;
