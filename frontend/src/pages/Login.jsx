import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password
      });
      
      // Save the token and user details to the browser's local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to the problem list
      navigate('/problems');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed. Check your credentials.');
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginTop: '10px', marginBottom: '20px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1e1e1e' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>
        
        <label>Email</label>
        <input required style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

        <label>Password</label>
        <input required style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

        <button type="submit" style={{ width: '100%', backgroundColor: '#2196f3', color: 'white', padding: '15px', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Log In
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4caf50', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
}