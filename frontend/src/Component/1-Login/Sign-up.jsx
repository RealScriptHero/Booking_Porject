import React, { useState, useEffect } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../../api';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.password) {
            alert('Please fill in all required fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            await createUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: 'USER'
            });

            alert('Account created successfully! Please log in.');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Unable to create account. Please try again.');
        }
    };

    const [forkStyle, setForkStyle] = useState({ transform: 'translateY(0px)' });
    useEffect(() => {
        const interval = setInterval(() => {
            setForkStyle(prev => ({
                transform: prev.transform === 'translateY(0px)' ? 'translateY(-5px)' : 'translateY(0px)',
                transition: 'transform 0.5s'
            }));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f7f8fa'
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    padding: '40px',
                    width: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <h2
                    style={{
                        color: '#f59e0b',
                        fontSize: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 'bold',
                        justifyContent: 'center'
                    }}
                >
                    Create an Account <FaUtensils style={{ color: '#f5550bff', fontSize: '24px', ...forkStyle }} />
                </h2>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }} onSubmit={handleSubmit}>
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Create an Account</h1>

                    <label style={{ textAlign: 'left' }}>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your Full Name"
                        style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <label style={{ textAlign: 'left' }}>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <label style={{ textAlign: 'left' }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create Password"
                        style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <label style={{ textAlign: 'left' }}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #d1d5db',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            padding: '14px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: '#f5550bff',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '8px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f59e0b')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f5550bff')}
                    >
                        Sign Up
                    </button>
                    <br />
                    <p>Already have an account? <Link to="/" style={{ color: '#f5550bff' }}>Log in</Link></p>
                </form>
            </div>
        </div>
    );
}
