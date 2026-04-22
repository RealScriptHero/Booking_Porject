import React, { useState } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api';

export default function Login() {
    const [LoginData, setLoginData] = useState({
        Addres: "",
        Password: ""
    });
    const usenavigate = useNavigate();
    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...LoginData, [name]: value });
    };

    const sending = async (e) => {
        e.preventDefault();

        try {
            const user = await loginUser({
                email: LoginData.Addres,
                password: LoginData.Password
            });

            localStorage.setItem('currentUser', JSON.stringify(user));

            if (user.role === 'ADMIN') {
                usenavigate('/admin/menu');
            } else {
                usenavigate('/home');
            }
        } catch (error) {
            alert('Error: Invalid email or password');
            console.error(error);
        }
    };


    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    padding: '40px',
                    width: '380px',
                    transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
                <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={sending}>
                    <h2
                        style={{
                            color: '#f5550bff',
                            fontSize: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 'bold',
                            marginBottom: '16px'
                        }}
                    >
                        <FaUtensils style={{ color: '#f5550bff', fontSize: '24px' }} /> Reserve
                    </h2>

                    <h1
                        style={{
                            color: '#f5550bff',
                            fontSize: '28px',
                            fontWeight: '800',
                            marginBottom: '8px'
                        }}
                    >
                        Welcome Back
                    </h1>

                    <p
                        style={{
                            color: '#4b5563',
                            marginBottom: '24px'
                        }}
                    >
                        Log in to your account to manage your <br /> reservations.
                    </p>

                    <label style={{ color: '#374151', fontWeight: '500', marginBottom: '4px' }}>
                        Email Address
                    </label>
                    <input
                        type="text"
                        name="Addres"
                        value={LoginData.Addres}
                        onChange={handleChangeLogin}
                        placeholder="You@gmail.com"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            marginBottom: '16px',
                            outline: 'none'
                        }}
                    />

                    <label style={{ color: '#374151', fontWeight: '500', marginBottom: '4px' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        name="Password"
                        value={LoginData.Password}
                        onChange={handleChangeLogin}
                        placeholder="Enter your password"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            marginBottom: '24px',
                            outline: 'none'
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: '#f5550bff',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f59e0b')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fbbf24')}
                    >
                        Log in
                    </button>
                    <br /> <br />
                    <p>Don't have an account ? <Link to="/Sign-up" style={{color : '#f5550bff'}}> Sign up</Link> </p>
                </form>
            </div>
        </div>
    );
}
