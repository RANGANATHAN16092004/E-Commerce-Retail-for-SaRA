import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-border p-12 max-w-md w-full shadow-lg"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl serif mb-2 text-black">Welcome Back</h2>
          <p className="text-muted text-xs uppercase tracking-widest">Login to your account</p>
        </div>


        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
            <input 
              type="email" 
              className="luxury-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Password</label>
            <input 
              type="password" 
              className="luxury-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="luxury-btn w-full py-4 mt-4 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-muted">
          Don't have an account? <Link to="/register" className="text-secondary hover:underline">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
