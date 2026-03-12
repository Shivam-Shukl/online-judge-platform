import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        username,
        email,
        password
      });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginTop: '10px', marginBottom: '20px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1e1e1e' }}>
      <form onSubmit={handleRegister} style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create an Account</h2>
        
        <label>Username</label>
        <input required style={inputStyle} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., code_master" />

        <label>Email</label>
        <input required style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

        <label>Password</label>
        <input required style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

        <button type="submit" style={{ width: '100%', backgroundColor: '#4caf50', color: 'white', padding: '15px', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sign Up
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa' }}>
          Already have an account? <Link to="/login" style={{ color: '#2196f3', textDecoration: 'none' }}>Log In</Link>
        </p>
      </form>
    </div>
  );
}