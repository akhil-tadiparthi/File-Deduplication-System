import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";

const Register = (props) => {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const [usernameError, setUsernameError] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();
        
    const onButtonClick = async () => {
        setUsernameError("")
        setNameError("")
        setEmailError("")
        setPasswordError("")

        if ("" === username) {
            setUsernameError("Please enter your name")
            return
        }
        
        if ("" === name) {
            setNameError("Please enter your name")
            return
        }

        if ("" === email) {
            setEmailError("Please enter your email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }    
        
        
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    name: name,
                    email: email,
                    password: password,
                }),
            });
    
            if (response.ok) {
                console.log('Registration successful!');
                navigate('/login')
            } else {
                console.error('Registration failed:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

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
        <NavBar />
        <div className={"titleContainer"}>
            <div>Register</div>
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
            <input
                value={name}
                placeholder="Enter your name here"
                onChange={ev => setName(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{nameError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={email}
                placeholder="Enter your email here"
                onChange={ev => setEmail(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
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
                value={"Register"} />
        </div>
    </div>
}

export default Register