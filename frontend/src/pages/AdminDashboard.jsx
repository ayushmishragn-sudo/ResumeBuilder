import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AdminDashboard({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage for mock auth
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role === 'admin') {
        setIsAdmin(true);
        fetchData();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [{ data: usersData }, { data: resumesData }] = await Promise.all([
        axios.get('/api/auth/users', config),
        axios.get('/api/resume/all', config)
      ]);
      setUsers(usersData);
      setResumes(resumesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ color: '#fff', paddingTop: '100px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  if (!isAdmin) {
    return (
      <div style={{ color: '#ff4b4b', paddingTop: '100px', textAlign: 'center' }}>
        <h2>Forbidden</h2>
        <p>You must be an admin to view this page.</p>
        <button className="btn-secondary" onClick={() => onNavigate('landing')}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Dashboard</h1>
      <p style={{ color: '#a5b4fc', marginBottom: '32px' }}>View all authenticated users stored in MongoDB.</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '24px', borderRadius: '16px' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Avatar</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Name</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Email</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Provider</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Role</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>
                  <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="avatar" referrerPolicy="no-referrer" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                </td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{u.name}</td>
                <td style={{ padding: '12px', color: '#9ca3af' }}>{u.email}</td>
                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.provider}</td>
                <td style={{ padding: '12px', color: u.role === 'admin' ? '#fbbf24' : '#fff' }}>{u.role}</td>
                <td style={{ padding: '12px', color: '#9ca3af', fontSize: '13px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>No users found. Test the login!</div>}
      </motion.div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '60px', marginBottom: '16px' }}>Generated Resumes</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '24px', borderRadius: '16px', marginBottom: '80px' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Resume User / Owner</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Full Name (Inside Resume)</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Professional Role</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Template</th>
              <th style={{ padding: '12px', color: '#818cf8', fontWeight: '500' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((r, index) => (
              <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{r.userEmail || 'Anonymous'}</td>
                <td style={{ padding: '12px', color: '#fff' }}>{r.content?.header?.name || 'N/A'}</td>
                <td style={{ padding: '12px', color: '#9ca3af' }}>{r.content?.header?.title || r.content?.experience?.[0]?.title || 'N/A'}</td>
                <td style={{ padding: '12px', color: '#a5b4fc', textTransform: 'capitalize' }}>{r.content?.template || 'Standard'}</td>
                <td style={{ padding: '12px', color: '#9ca3af', fontSize: '13px' }}>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {resumes.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>No resumes generated yet.</div>}
      </motion.div>
    </div>
  );
}
