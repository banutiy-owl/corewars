import { React, useEffect, useState } from "react";

import Header from "./Header";
import "./HomePage.css";

function HomePage() {
  const [username, setusername] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setusername(storedUsername);
    }
  }, []);
  return (
    <div className="body">
      <Header />
      <div className="header">
        <div className="user-text-welcome">
          Welcome {username}
          <div className="underline"></div>
        </div>
        
      </div>
      
      <div className="description-text-user">
        Core Wars is a programming game in which two or more programs run in a
        simulated computer with the goal of terminating every other program and
        surviving as long as possible.
      </div>
    </div>
  );
}

export default HomePage;
