import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { login } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', adminSecret: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') navigate('/admin/dashboard');
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin',
        adminSecret: formData.adminSecret
      });
      
      toast.success('Admin Account Created Successfully');
      dispatch(login({ email: formData.email, password: formData.password }));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 max-w-md w-full shadow-2xl border-t-4 border-gold"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl serif mb-2 text-black font-bold">Admin Portal</h2>
          <p className="text-muted text-[10px] uppercase font-bold tracking-[0.2em] text-gold">Initialize Management Profile</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-4 mb-6 text-[10px] uppercase font-bold tracking-widest text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 italic">Official Name</label>
            <input 
              type="text" 
              className="luxury-input w-full bg-accent/20"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 italic">Corporate Email</label>
            <input 
              type="email" 
              className="luxury-input w-full bg-accent/20"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 italic">Access Key (Password)</label>
            <input 
              type="password" 
              className="luxury-input w-full bg-accent/20"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gold mb-2 italic">Master Authorization Key</label>
            <input 
              type="password" 
              placeholder="Enter Private Admin Secret"
              className="luxury-input w-full bg-gold/5 border-gold/20"
              required
              onChange={(e) => setFormData({...formData, adminSecret: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 italic">Verify Access Key</label>
            <input 
              type="password" 
              className="luxury-input w-full bg-accent/20"
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all shadow-lg mt-4 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Initializing...' : 'Authorize Admin'}
          </button>
        </form>

        <div className="mt-8 text-center text-[9px] uppercase font-bold tracking-widest text-muted">
          For authorized personnel only. 
          <Link to="/login" className="block mt-4 text-black hover:text-gold transition-colors underline">Existing Admin Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
