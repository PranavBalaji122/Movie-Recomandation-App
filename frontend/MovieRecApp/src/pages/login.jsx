import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, ID} from "../constants";
import './css/login.css';
import backgroundImg from '../assets/login_background_new.jpg'; 
import { FaExclamationCircle } from 'react-icons/fa'; 
import Logo from '../assets/LOGO_NEW_NEW.png'


function Login() {
    const route = 'token/';
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error401, setError401] = useState(false);
    const [errorServerDown, setErrorServerDown] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError401(false); 
        setErrorServerDown(false);
        try {
            localStorage.clear()    
            const res = await api.post(route, { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            const res1 = await api.get('getUserByUsername/'+username+"/");
            localStorage.setItem(ID, res1.data.id)
            navigate("/");
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                setError401(true);
            } else if (error.code === "ERR_NETWORK") {
                setErrorServerDown(true);
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = () =>{
        navigate("/about")
    }

    return (
        <div className="mainContainerLoginPage">
            <div className="formContainerLogin">
                <img src = {Logo} alt="LOGO" onClick={handleNavigate} ></img>
                <h1 className="greetingText">Welcome Back</h1>
                <p>Hey, welcome back to your movie collection</p>
                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <input
                            className="formInput"
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label className="floatingLabel">Email</label>
                    </div>
                    <div className="inputContainer">
                        <input
                            className="formInput"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label className="floatingLabel">Password</label>
                    </div>
                    <div className="options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <button className="formButtonLogin" type="submit">
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                </form>
                <div className="signup">
                    <span>Don’t have an account? </span>
                    <a href="/register">Sign Up</a>
                </div>
                {error401 && (
                    <div className="incorrectPassword">
                        <FaExclamationCircle className="errorIcon"/>
                        <p>Incorrect Password or Username</p>
                    </div>
                )}
                {errorServerDown && (
                    <div className="serverDown">
                        <p>Server is down bud</p>
                    </div>
                )}
            </div>
            <div className="backgroundContainer">
                <img src={backgroundImg} alt="Background" className="illustration" />
            </div>
        </div>
    );
}

export default Login;
