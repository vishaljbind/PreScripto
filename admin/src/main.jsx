import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  AdminContextProvider,
  DoctorContextProvider,
  AppContextProvider,
} from "./context";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <DoctorContextProvider>
        <AdminContextProvider>
          <App />
        </AdminContextProvider>
      </DoctorContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
