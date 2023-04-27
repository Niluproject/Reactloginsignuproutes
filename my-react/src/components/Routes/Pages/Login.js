import React, { useEffect } from 'react'
import '../assets/css/login.css'
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
// import ResetPassword from './ResetPassword';
const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const item = localStorage.getItem('user');
    console.log('item', user);
    const auth = item !== '' ? JSON.parse(item) : '';
    if (auth) {
      navigate("/")
    }
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value
    })
  }

  const handleForgotPassword = () => {
    Swal.fire({
      title: "Enter your email",
      input: "email",
      confirmButtonText: "Reset Password",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter your email";
        }
      },
      preConfirm: async (email) => {
        try {
          const response = await axios.post("http://localhost:9003/forgot-password", { email });
          const message = response.data.message;
          Swal.fire({
            title: "Success!",
            text: message,
            icon: "success",
          });
        } catch (error) {
          const errorMessage = error.response.data.error;
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      },
    });
  };

  const handleLogin = () => {
    const { email, password } = user
    if (email && password) {
      axios.post("http://localhost:9003/login", user)
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          Swal.fire({
            title: "SUCCESS!",
            text: res.data.message,
            icon: "success",
            confirmButtonColor: "#007aff",
            width: 400,
          }).then(() => {
            const item = localStorage.getItem('user');
            const auth = item !== '' ? JSON.parse(item) : '';
            if (auth && !auth.redirected) {
              localStorage.setItem('user', JSON.stringify({ ...auth, redirected: true }));
              navigate("/")
            }
          });
        }).catch(error => {
          Swal.fire({
            title: "UNAUTHORIZE!",
            text: error.response.data.error,
            icon: "error",
            confirmButtonColor: "#007aff",
            width: 400,
          });
        });
    } else {
      Swal.fire({
        title: "Wrong",
        text: "Please provide a valid email and password",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter Your Email"></input>
      <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter Your Password"></input>
      <div className="button" onClick={handleLogin}>Login</div>
      <div className="forgot-password" onClick={handleForgotPassword}>Forgot password?</div>
      <div>or</div>
      <div className="button" onClick={() => navigate("/signup")}>Register</div>
    </div>
  )
}

export default Login
