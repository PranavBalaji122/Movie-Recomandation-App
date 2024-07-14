import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from 'react-icons/fa';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, ID} from "../constants";
import backgroundImg from '../assets/login_background_new.jpg'; 
import Logo from '../assets/LOGO_NEW_NEW.png'


function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error401, setError401] = useState(false);
    const [errorServerDown, setErrorServerDown] = useState(false);
    const route = "register/";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            localStorage.clear()
            const res = await api.post(route, { 
                username, 
                password,
                profile: {} 

            });
            localStorage.setItem(ID,res.data.id)
            await logUserIn(); 
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const logUserIn = async () => {
        try {
            const res = await api.post("token/", { username, password });
            console.log(res.data)
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                setError401(true);
            } else if (error.code === "ERR_NETWORK") {
                setErrorServerDown(true);
            }
            console.error(error);
        }
    };
    const handleNavigate = () =>{
        navigate("/about")
    }

    return (
        <div className="mainContainerLoginPage">
            <div className="formContainerLogin">
                <img src = {Logo} alt="LOGO" onClick={handleNavigate}></img>
                <h1 className="greetingText">Welcome to your Movie Collection</h1>
                <p>Hey, create an account to create your movie collection</p>
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
                    <button className="formButtonLogin" type="submit">
                        {loading ? "Loading..." : "Create Account"}
                    </button>
                </form>
                <div className="signup">
                    <span>Already have an account?</span>
                    <a href="/login">Sign In</a>
                </div>
                {error401 && (
                    <div className="incorrectPassword">
                        <FaExclamationCircle className="errorIcon" />
                        <p>The username or password provided is incorrect.</p>
                    </div>
                )}
                {errorServerDown && (
                    <div className="serverDown">
                        <p>Server is down, please try again later.</p>
                    </div>
                )}
            </div>
            <div className="backgroundContainer">
                <img src={backgroundImg} alt="Background" className="illustration" />
            </div>
        </div>
    );
}

export default Register;
