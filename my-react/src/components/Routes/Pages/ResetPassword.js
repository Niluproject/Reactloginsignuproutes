import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = () => {
        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Passwords do not match',
                icon: 'error',
                confirmButtonColor: '#007aff',
                width: 400,
            });
            return;
        }

        axios.post('http://localhost:9003/reset-password', { resetToken, password })
            .then((res) => {
                Swal.fire({
                    title: 'SUCCESS!',
                    text: res.data.message,
                    icon: 'success',
                    confirmButtonColor: '#007aff',
                    width: 400,
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: error.response.data.error,
                    icon: 'error',
                    confirmButtonColor: '#007aff',
                    width: 400,
                });
            });
    };

    return (
        <div className='reset-password'>
            <h2>Reset Password</h2>
            <input
                type='text'
                name='resetToken'
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder='Enter Your Reset Token'
            />
            <input
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter Your New Password'
            />
            <input
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm Your New Password'
            />
            <button className='button' onClick={handleResetPassword}>
                Reset Password
            </button>
        </div>
    );
};

export default ResetPassword;
