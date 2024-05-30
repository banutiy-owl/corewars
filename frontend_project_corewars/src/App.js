import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpPage from "./components/screens/auth/SignUpPage/SignUpPage";
import LoginPage from "./components/screens/auth/LoginPage/LoginPage";
import WelcomePage from "./components/screens/WelcomePage/WelcomePage";
import HomePage from "./components/screens/HomePage/HomePage";
import WarriorsPage from "./components/screens/ListWarriorsPage/WarriorsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/warriors" element={<WarriorsPage />} />
      </Routes>
    </Router>
  );
}

export default App;