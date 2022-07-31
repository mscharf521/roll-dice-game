import './Home.css';
import { dice_paths, but_color } from './constants.js'

import React, { useEffect, useState } from 'react';
import axios from "axios";
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useNavigate } from "react-router-dom";
import AlertSystem from './AlertSystem'

function Home()
{
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dice, setDice] = useState([1,1]);
    const [alerts, SetAlerts] = useState([]);
    
    let next_alert_id = 0;

    const handleLogin = async (event) => {
        event.preventDefault();
        if(username === "" || password === "") { invalid_username_password(); return; }
        axios.get("/login/" + username + "/" + password + "/")
        .then((res) => {
            if(res.data.user_id)
            {
                login(res.data.user_id)
            }
        })
        .catch((err)=>{
            //console.log(err)
            if(err.message === 'Network Error')
            {
                addAlert(err.message, null)
            }
            if(err.response.data.err_msg)
            {
                addAlert(err.response.data.err_msg, null)
            }
        });
      };

      const handleSignup = async (event) => {
        event.preventDefault();
        if(username === "" || password === "") { invalid_username_password(); return; }
        axios.post("/signup/" + username + "/" + password + "/")
        .then((res) => {
            if(res.data.user_id)
            {
                login(res.data.user_id)
            }
        })
        .catch((err)=>{
            //console.log(err)
            if(err.message === 'Network Error')
            {
                addAlert(err.message, null)
            }
            if(err.response.data.err_msg)
            {
                addAlert(err.response.data.err_msg, null)
            }
        });
      };

    const login = async (user_id) => {
        await localStorage.setItem("user_id", user_id);
        navigate("/game");
    }

    const invalid_username_password = () => {
        addAlert("Username and Password are required")
    }

    const addAlert = (text, OnClickFunc, duration) => {
        SetAlerts(current => ([...current, {text, id:next_alert_id, OnClickFunc}]))
        let tmp_id = next_alert_id;
        setTimeout(function() {
        removeAlert(tmp_id)
        }, duration || 2000)
        next_alert_id += 1;
    }

    const removeAlert = (rm_id) => {
        SetAlerts(current => {
        let idx = current.findIndex(alert => alert.id === rm_id);
        if(idx !== -1)
        {
            current.splice(idx, 1);
        }
        return [...current];
        })
    }

    useEffect(() => {
        setDice([Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)])
    }, [])

    return (
        <div className="HomePage">
            <AlertSystem alerts={alerts} removeAlert={removeAlert}/>
            <div className="HomePageWrapper">

                <div className="TitleDiv">
                    <img className="TitleDice" src={dice_paths[dice[0]]} alt="" />
                    Dice Roller
                    <img className="TitleDice" src={dice_paths[dice[1]]} alt="" />
                </div>
                <form className="HomePageForm">
                    <TextField 
                        name="username"
                        autoComplete='off'
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                    <TextField 
                        name="password"
                        autoComplete='off'
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    <div className="HomePageButDiv">
                        <Button
                            className="HomePageBut"
                            variant="contained"
                            color="primary"
                            onClick={handleLogin}
                            style={{ backgroundColor: but_color, width: '150px', height: '50px', fontSize: '1.5em'}}>Login</Button>
                        <Button
                            className="HomePageBut"
                            variant="contained"
                            color="primary"
                            onClick={handleSignup}
                            style={{ backgroundColor: but_color, width: '150px', height: '50px', fontSize: '1.5em'}}>Sign up</Button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default Home;