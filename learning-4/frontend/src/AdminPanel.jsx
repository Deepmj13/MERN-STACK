import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './pages.css';

const AdminPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchOrders(token);
    }, [navigate]);

    const fetchOrders = async (token) => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
                toast.error('Session expired, please login again.');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
                toast.error('Session expired, please login again.');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            toast.success(`Order status updated to ${newStatus}`);
            // Refresh the orders after update
            fetchOrders(token);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <header className="page-header">
                <div className="container row">
                    <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FormBoost Admin</a>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            navigate('/admin/login');
                            toast.success('Logged out successfully');
                        }}
                        style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="container page-grid" style={{ gridTemplateColumns: '1fr' }}>
                <section className="card wide">
                    <h1>Order Approvals</h1>
                    <p className="lead">Manage user orders and their status.</p>

                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    {loading ? (
                        <p>Loading orders...</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '1.5rem' }}>
                            {orders.map((order) => {
                                let statusBg = '#1c2825';
                                let statusColor = 'var(--muted)';
                                let statusBorder = 'var(--line)';

                                if (order.status === 'Approved') {
                                    statusBg = 'rgba(49, 160, 111, 0.1)';
                                    statusColor = '#4fa57a';
                                    statusBorder = 'rgba(49, 160, 111, 0.3)';
                                } else if (order.status === 'Rejected') {
                                    statusBg = 'rgba(255, 99, 71, 0.1)';
                                    statusColor = '#ff6347';
                                    statusBorder = 'rgba(255, 99, 71, 0.3)';
                                } else if (order.status === 'Confirmed') {
                                    statusBg = 'rgba(114, 206, 159, 0.1)';
                                    statusColor = '#72ce9f';
                                    statusBorder = 'rgba(114, 206, 159, 0.3)';
                                }

                                return (
                                    <article key={order._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{order.clientName}</h3>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{order.contact}</p>
                                            </div>
                                            <span style={{
                                                padding: '0.25rem 0.6rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: statusBg,
                                                color: statusColor,
                                                border: `1px solid ${statusBorder}`
                                            }}>{order.status}</span>
                                        </div>

                                        <div style={{ padding: '0.8rem 0', borderTop: '1px dashed var(--line)', borderBottom: '1px dashed var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <div>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Amount</p>
                                                <p style={{ fontWeight: '600', fontSize: '1rem' }}>INR {order.amount}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Responses</p>
                                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{order.responses}</p>
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Audience</p>
                                                <p style={{ fontSize: '0.85rem' }}>{order.audience}</p>
                                            </div>
                                        </div>

                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Notes</p>
                                            <p style={{ fontSize: '0.85rem' }}>{order.notes || 'None'}</p>
                                            <a href={order.formLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--brand)', display: 'inline-block', marginTop: '0.4rem', textDecoration: 'underline' }}>View Form Link</a>
                                        </div>

                                        {order.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleStatusChange(order._id, 'Approved')}
                                                    className="btn btn-outline"
                                                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', color: '#4fa57a', borderColor: 'var(--line)' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(order._id, 'Rejected')}
                                                    className="btn btn-outline"
                                                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', color: '#ff6347', borderColor: 'var(--line)' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                            {orders.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', border: '1px dashed var(--line)', borderRadius: 'var(--radius)' }}>
                                    <p style={{ color: 'var(--muted)' }}>No orders found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};

export default AdminPanel;
