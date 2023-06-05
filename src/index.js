// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import App from "./App";
import { ToastProvider } from "react-toast-notifications";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <ToastProvider autoDismiss autoDismissTimeout={5000} placement="top-right">
    <App />
  </ToastProvider>
  // </StrictMode>
);
