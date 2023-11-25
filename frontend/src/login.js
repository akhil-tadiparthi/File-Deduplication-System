import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Login = () => {
    const {setUser} = useContext(AuthContext); // Extract setUser from AuthContext
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const navigate = useNavigate();
        
    const onButtonClick = async () => {
        setUsernameError("");
        setPasswordError("");

        if ("" === username) {
            setUsernameError("Please enter your username");
            return;
        }

        if ("" === password) {
            setPasswordError("Please enter a password");
            return;
        }

        try {
            const response = await fetch('http://192.168.1.10:30010/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('username', JSON.stringify(userData.username));
                setUser(userData.username);
                navigate('/dashboard');
            } else {
                console.error('Login failed:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const NavBar = () => {
        return (
            <div className="navBar">
                <div className="navLeft">
                    <Link to="/" className="navItem">File De-Duplication Service</Link>
                </div>
                <div className="navRight">
                    <Link to="/register" className="navItem">Register</Link>
                    <Link to="/login" className="navItem">Login</Link>
                </div>
            </div>
        );
    };

    return <div className={"mainContainer"}>
        <NavBar/>
        <div className={"titleContainer"}>
            <div>Login</div>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={username}
                placeholder="Enter your username here"
                onChange={ev => setUsername(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{usernameError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input type = "password"
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Log In"} />
        </div>
    </div>
}

export default Login