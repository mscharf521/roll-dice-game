import "./Game.css";
import { dice_paths, but_color } from "./constants.js";

import axios from "axios";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useWindowSize from "./WindowSize.js";
import Confetti from "react-confetti";

function Game() {
  const navigate = useNavigate();

  const { width, height } = useWindowSize();

  const user_id = localStorage.getItem("user_id");

  const [username, setUsername] = useState("");
  const [highscore, setHighscore] = useState(0);
  const [day_highscore, setDayHighscore] = useState(0);
  const [current_score, setCurrentScore] = useState();

  const [confetti_num_pieces, SetConfettiNumPieces] = useState(0);

  const [roll_btn_disabled, setRollBtnDisabled] = useState(false);
  const [roll_anim, setRollAnim] = useState(false);
  const [rolls, setRolls] = useState([1, 1, 1]);

  const [all_time_leaderboard, setAllTimeLeaderboard] = useState([]);
  const [today_leaderboard, setTodayLeaderboard] = useState([]);

  // Update user data
  useEffect(() => {
    if (user_id === null) {
      logout();
    }
    try {
      axios
        .get("/user/" + user_id)
        .then((res) => {
          setUsername(res.data.username);
        })
        .catch((err) => {
          logout();
        });
    } catch (error) {
      console.error(error);
    }
  }, [user_id, navigate]);

  // Update score data
  useEffect(() => {
    if (user_id !== null) {
      axios
        .get("/highscore/" + user_id)
        .then((res) => {
          setHighscore(res.data.score);
        })
        .catch((err) => {
          logout();
        });
      axios
        .get("/highscore/today/" + user_id)
        .then((res) => {
          setDayHighscore(res.data.day_score);
        })
        .catch((err) => {
          logout();
        });
      axios
        .get("/highscores/")
        .then((res) => {
          setAllTimeLeaderboard(res.data);
        })
        .catch((err) => {
          logout();
        });
      axios
        .get("/highscores/today")
        .then((res) => {
          setTodayLeaderboard(res.data);
        })
        .catch((err) => {
          logout();
        });
    }
  }, [user_id, highscore, day_highscore]);

  // Handle a roll button press
  const handleRoll = async (event) => {
    event.preventDefault();
    setRollBtnDisabled(true);
    try {
      setRollAnim(true);
      const { data } = await axios
        .post("/roll/6/3/" + user_id + "/")
        .catch((err) => {
          logout();
        });
      await sleep(1000);
      setRolls(data.rolls);
      setRollAnim(false);
      setCurrentScore(data.sum);
      setRollBtnDisabled(false);

      if (data.day_highscore) {
        setDayHighscore(data.sum);
      }
      if (data.highscore) {
        setHighscore(data.sum);

        // Run Confetti animation
        SetConfettiNumPieces(150);
        await sleep(4000);
        SetConfettiNumPieces(0);
      }
    } catch (error) {
      console.error(error);
      setRollBtnDisabled(false);
    }
  };

  // Handle the logout button press
  const handleLogout = async (event) => {
    event.preventDefault();
    logout();
  };

  // Logout the user and return home
  const logout = async () => {
    await localStorage.removeItem("user_id");
    navigate("/");
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="GamePage">
      <div className="NavBar">
        <div className="Welcome">WELCOME {username}</div>
        <div className="Logout">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            style={{ backgroundColor: but_color }}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="DiceWrapper">
        <div className="DiceDiv">
          {rolls.map((roll, index) => (
            <img
              className={"Dice" + (roll_anim ? " DiceAnim" : "")}
              src={dice_paths[roll - 1]}
              alt=""
              key={index}
            />
          ))}
        </div>
        <div className="ScoreDiv">{current_score}</div>
      </div>
      <div className="RollBut">
        <Button
          variant="contained"
          color="primary"
          onClick={handleRoll}
          disabled={roll_btn_disabled}
          style={{
            backgroundColor: but_color,
            width: "100px",
            height: "50px",
            fontSize: "1.5em",
          }}
        >
          Roll
        </Button>
      </div>
      <div className="LeaderboardWrapper">
        <div className="LeadboardDiv AllTimeDiv">
          <div className="LeaderboardHeader">ALL-TIME HIGHSCORES</div>
          <div className="LeaderboardScroll">
            {all_time_leaderboard.map((data, index) => (
              <div
                className={
                  "LeaderboardRow" + (index % 2 ? " EvenRow" : " OddRow")
                }
                key={index}
              >
                <div className="RowPosition">{index + 1}</div>
                <div className="RowUsername">{data.username}</div>
                <div className="RowScore">{data.score}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="LeadboardDiv HighscoreDiv">
          <div className="LeaderboardHeader2">PERSONAL STATS</div>
          <br></br>
          <div className="LeaderboardHeader">ALL-TIME HIGHSCORE</div>
          <div className="PersonalScore">{highscore}</div>
          <div className="LeaderboardHeader">TODAY'S HIGHSCORE</div>
          <div className="PersonalScore">{day_highscore}</div>
        </div>
        <div className="LeadboardDiv TodayDiv">
          <div className="LeaderboardHeader">TODAY'S HIGHSCORES</div>
          <div className="LeaderboardScroll">
            {today_leaderboard.map((data, index) => (
              <div
                className={
                  "LeaderboardRow" + (index % 2 ? " EvenRow" : " OddRow")
                }
                key={index}
              >
                <div className="RowPosition">{index + 1}</div>
                <div className="RowUsername">{data.username}</div>
                <div className="RowScore">{data.day_score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Confetti
        width={width}
        height={height}
        numberOfPieces={confetti_num_pieces}
      />
      <div
        className={
          "HighscoreNoticeDiv" +
          (confetti_num_pieces ? " HighscoreNoticeDivAnim" : "")
        }
      >
        NEW HIGHSCORE
      </div>
    </div>
  );
}

export default Game;
