import React, { useEffect } from 'react';
import '../assets/css/login.css';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const item = localStorage.getItem('user');
    console.log('item', user);
    const auth = item !== '' ? JSON.parse(item) : '';
    if (auth) {
      navigate('/');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Enter your email',
      input: 'email',
      confirmButtonText: 'Reset Password',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter your email';
        }
      },
      }).then((result) => {
        if (result.isConfirmed) {
          const email = result.value;
          axios
            .post('/api/forgot-password', { email })
            .then((response) => {
              Swal.fire('Success', response.data.message, 'success');
            })
            .catch((error) => {
              Swal.fire('Error', error.response.data.error, 'error');
            });
        }
      });
  
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post('/api/login', user)
        .then((response) => {
          localStorage.setItem('user', JSON.stringify(response.data));
          setUser({
            email: '',
            password: '',
          });
          navigate('/');
        })
        .catch((error) => {
          Swal.fire('Error', error.response.data.error, 'error');
        });
    };
  
    return (
      <>
        <div className='container login-container'>
          <div className='row'>
            <div className='col-md-6 login-form'>
              <h3>Login</h3>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Email'
                    name='email'
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    className='form-control'
                    placeholder='Password'
                    name='password'
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <button type='submit' className='btn btn-primary'>
                    Login
                  </button>
                </div>
              </form>
              <div className='forgot-password'>
                <button type='button' className='btn btn-link' onClick={handleForgotPassword}>
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
        <ResetPassword />
      </>
    );
  };
  
  export default Login;
