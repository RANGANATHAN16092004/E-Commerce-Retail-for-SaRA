import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { login } from '../../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      dispatch(login({ email: formData.email, password: formData.password }));
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 max-w-md w-full"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl serif mb-2">Join the Nest</h2>
          <p className="text-muted text-xs uppercase tracking-widest">Create your luxury profile</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Full Name</label>
            <input 
              type="text" 
              className="luxury-input w-full"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
            <input 
              type="email" 
              className="luxury-input w-full"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Password</label>
            <input 
              type="password" 
              className="luxury-input w-full"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Confirm Password</label>
            <input 
              type="password" 
              className="luxury-input w-full"
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="luxury-btn w-full py-4 mt-4 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-muted">
          Already have an account? <Link to="/login" className="text-secondary hover:underline">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
