import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Store, StoreContext} from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreContext.Provider value={new Store()}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StoreContext.Provider>
);
