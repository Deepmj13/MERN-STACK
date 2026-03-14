import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './pages.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token and show success
            localStorage.setItem('adminToken', data.token);
            toast.success('Login successful!');
            navigate('/admin');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="page-header">
                <div className="container row">
                    <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FormBoost Admin</a>
                </div>
            </header>

            <main className="container page-grid" style={{ minHeight: '60vh', placeItems: 'center', gridTemplateColumns: '1fr' }}>
                <section className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center' }}>Admin Login</h1>
                    <p className="lead" style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign in to manage requests.</p>

                    <form className="form-grid" onSubmit={handleLogin} style={{ gridTemplateColumns: '1fr' }}>
                        <label className="full">
                            Username
                            <input
                                type="text"
                                id="username"
                                required
                                value={credentials.username}
                                onChange={handleChange}
                                autoFocus
                            />
                        </label>
                        <label className="full">
                            Password
                            <input
                                type="password"
                                id="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </label>

                        <button className="btn btn-primary full" type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
};

export default AdminLogin;
