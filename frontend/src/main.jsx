import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { OptionProvider } from "./OptionContext";
createRoot(document.getElementById("root")).render(
 <OptionProvider>
  <BrowserRouter>
   <App />
  </BrowserRouter>
 </OptionProvider>
);
