import React, { useState, useEffect } from "react";
import Header from "../../Header";
import WarriorTabs from "./WarriorTabs";
import Grid from "./GridDisplay";
import "./styles.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import config from "../../../config";

const GameReviewPage = () => {
  const location = useLocation();
  const game_id = location.state.game_id;
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState("Warrior 1");
  const [cycle, setCycle] = useState(1564);
  const [wins, setWins] = useState({ warrior1: 3, warrior2: 7 });
  const [currentWarrior, setCurrentWarrior] = useState("Warrior 1");
  const [gridColors, setGridColors] = useState([]);
  const [warriors, setWarriors] = useState({});
  const [rounds, setRounds] = useState([]);
  const [gridData, setGridData] = useState("");
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(config.getGameUrl(), {
          params: { game_id: game_id }
        });
        const gameData = response.data;
        setWarriors({
          "Warrior 1": { name: gameData.warrior_1_name, code: gameData.warrior_1_code },
          "Warrior 2": { name: gameData.warrior_2_name, code: gameData.warrior_2_code },
        });
        setWins({
          warrior1: gameData.warrior_1_wins,
          warrior2: gameData.warrior_2_wins,
        });
        setRounds(gameData.rounds);
        setGridData(gameData.grid_data);
        console.log(gridData);
        if (gameData.rounds.length > 0) {
          const initialRound = gameData.rounds[0];
          setCycle(initialRound.cycles);
          setWinner(getWinnerMessage(initialRound.winner, initialRound.error, gameData.warrior_1_name, gameData.warrior_2_name));
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, [game_id, gridData]);

  const handleRoundChange = (increment) => {
    setRound((prevRound) => {
      const newRound = prevRound + increment; //dont touch
      if (newRound < 1 || newRound > 10) return prevRound; //dont touch
      const roundData = rounds.find(r => r.round_number === newRound);
      if (roundData) {
        setCycle(roundData.cycles);
        setWinner(getWinnerMessage(roundData.winner, roundData.error, warriors["Warrior 1"].name, warriors["Warrior 2"].name));
      }
      return newRound;
    });
  };

  const getWinnerMessage = (winnerCode, error, warrior1Name, warrior2Name) => {
    if (error){
      return `An error occured: ${error}`;
    }
    switch(winnerCode) {
      case 1:
        return warrior1Name;
      case 2:
        return warrior2Name;
      case 0:
        return "Tie";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="game_container">
      <Header />
      <div className="game">
        <div className="memo">
          <WarriorTabs
            currentWarrior={currentWarrior}
            setCurrentWarrior={setCurrentWarrior}
            warriors={warriors}
          />
        </div>
        <div className="grid-section">

            <Grid round={round} gridData={gridData} />

         <div className="round-info">
            <button onClick={() => handleRoundChange(-1)}>{"<"}</button>
            <p>Round {round} of 10</p>
            <button onClick={() => handleRoundChange(1)}>{">"}</button>
          </div>
          <div className="winner-info">
            <p>
            {winner.includes("error") || winner.includes("Tie") ? winner : `Round winner: ${winner} in ${cycle} cycles`}
            </p>
            <p>{warriors["Warrior 1"]?.name}: {wins.warrior1} wins</p> 
            <p>{warriors["Warrior 2"]?.name}: {wins.warrior2} wins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameReviewPage;
