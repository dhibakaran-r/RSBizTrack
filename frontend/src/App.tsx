import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/Routes";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./index.css";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </BrowserRouter>
    </Provider>
  );
}

export default App;