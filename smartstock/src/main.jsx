import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/authContext.jsx";
import { ItemProvider } from "./context/itemContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <ItemProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ItemProvider>
    </StrictMode>
    ,
  </AuthProvider>,
);
