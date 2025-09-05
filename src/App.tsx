import { AuthProvider } from "./components/AuthProvider";
import { MainApp } from "./components/MainApp";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
