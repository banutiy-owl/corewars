import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpPage from "./components/screens/auth/SignUpPage/SignUpPage";
import LoginPage from "./components/screens/auth/LoginPage/LoginPage";
import WelcomePage from "./components/screens/WelcomePage/WelcomePage";
import HomePage from "./components/screens/HomePage/HomePage";
import WarriorsPage from "./components/screens/ListWarriorsPage/WarriorsPage";
import AddEditWarriorPage from "./components/screens/AddEditWarriorPage/AddEditWarriorPage";
import NewGamePage from "./components/screens/NewGamePage/NewGamePage";
import HistoryPage from "./components/screens/HistoryPage/HistoryPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/warriors" element={<WarriorsPage />} />
        <Route path="/warrior" element={<AddEditWarriorPage />} />
        <Route path="/new-game" element={<NewGamePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
