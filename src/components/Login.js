import React from 'react';
import axios from 'axios'
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
// const socket = io.connect("http://localhost:5000");
function LoginComponent() {
    const history = useNavigate();

    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')

    function submit(e) {
        e.preventDefault();
        
        axios.post("http://localhost:5000/", {
            Username: Username,
            Password: Password
            
        })
        .then(res => {
            if (res.data == "exist") {
                    // socket.emit("join_room", Username);
                    history("/home", { state: { Username: Username } })
                }
                else if (res.data == "notexist") {
                    alert("Invalid")
                }
            })
            .catch(e => {
                alert("Error")
                console.log(e);
            })

    }
    return (
        <div className="parent">
            <div className="parent_div">
                <h2><i className="fas fa-lock icon"></i> Login </h2>
                <form onSubmit={submit} className='login_register'>
                    <input type="text" id="email" onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Password" required />
                    <input type="submit" value="Login" />
                </form>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
