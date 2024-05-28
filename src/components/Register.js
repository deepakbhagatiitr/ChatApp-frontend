import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const history = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        await axios.post("http://localhost:5000/register", {
            Username: Username,
            Email: Email,

            Password: Password
        })
            .then(res => {
                if (res.data === "exist") {
                    alert("Email already exists");
                } else if (res.data === "notexist") {
                    history("/");
                }
            })
            .catch(e => {
                alert("Error");
                console.log(e);
            });
    }

    return (
        <div className="parent">

            <div className="container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className="login_register">
                    <input type="text" placeholder="Enter your Username" value={Username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="email" placeholder="Enter your Email Address" value={Email} onChange={(e) => setEmail(e.target.value)} required />

                    <input type="password" placeholder="Enter Password" value={Password} onChange={(e) => setPassword(e.target.value)} required />




                    <input type="submit" value="Register" />
                </form>
                <div className="register-link">
                    <p>Already have an Account? <Link to="/">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
