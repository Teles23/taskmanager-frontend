import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import "./index.css";
import AllRoutes from "./routes/routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  </StrictMode>
);
